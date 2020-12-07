import { Result } from '@badrap/result';
import groupBy from 'lodash.groupby';
import client from '../../../graphql/graphql-client';
import { ReportType } from '../../../graphql/types';
import { CursoredData, generateCursorData } from '../../cursored';
import {
  APIError,
  Coordinates,
  DepartureGroupsQuery,
  FavoriteDeparture
} from '../../types';
import {
  GroupsByIdDocument,
  GroupsByIdQuery,
  GroupsByIdQueryVariables,
  GroupsByNearestDocument,
  GroupsByNearestQuery,
  GroupsByNearestQueryVariables,
  QuayIdInStopsDocument,
  QuayIdInStopsQuery,
  QuayIdInStopsQueryVariables
} from './departure-group.graphql-gen';

export type DepartureGroupMetadata = CursoredData<StopPlaceGroup[]>;

export async function getDeparturesGroupedNearest(
  coordinates: Coordinates,
  distance: number = 1000,
  options: DepartureGroupsQuery,
  favorites?: FavoriteDeparture[]
): Promise<Result<DepartureGroupMetadata, APIError>> {
  let favoriteQuayIds: string[] | undefined = undefined;
  if (favorites?.length) {
    const quayIdsResult = await client.query<
      QuayIdInStopsQuery,
      QuayIdInStopsQueryVariables
    >({
      query: QuayIdInStopsDocument,
      variables: {
        stopIds: favorites.map(f => f.stopId)
      },
      fetchPolicy: 'cache-first'
    });

    if (quayIdsResult.errors) {
      return Result.err(new APIError(quayIdsResult.errors));
    }

    favoriteQuayIds = quayIdsResult.data.stopPlaces
      .flatMap(s => s.quays?.map(q => q.id))
      .filter(Boolean) as string[];
  }

  const variables: GroupsByNearestQueryVariables = {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
    timeRange: 86400 * 2, // Two days
    startTime: options.startTime,

    // Walking distance from `coordinates`
    distance,

    // This limits estimated calls
    limitPerLine: options.limitPerLine,
    // Ensure we get enough from different lines.
    // Total limit indicates overall limit for all estimated calls
    // Given that we say `limit` per line, we need to be sure
    // that the overall limit is high enough to get around 10 different lines.
    // We might want to increase this value, but it will have performance impact.
    totalLimit: options.limitPerLine * 10,

    // Used for paging, skip until `cursor` and only fetch `pageSize` number.
    fromCursor: options.cursor,
    // This limits number of stop places.
    pageSize: options.pageSize,

    filterByLineIds: favorites?.map(f => f.lineId),
    filterInput: favoriteQuayIds
      ? {
          quays: favoriteQuayIds
        }
      : undefined
  };

  const result = await client.query<
    GroupsByNearestQuery,
    GroupsByNearestQueryVariables
  >({
    query: GroupsByNearestDocument,
    variables
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  try {
    const edges = result.data.nearest?.edges ?? [];
    const stopPlaces = edges.map(i => i.node?.place);
    const data = mapQueryToGroups(
      stopPlaces as GroupsByIdQuery['stopPlaces'],
      favorites
    );

    const pageInfo = result.data.nearest?.pageInfo;
    return Result.ok(
      generateCursorData(
        data,
        {
          hasNextPage: pageInfo?.hasNextPage ?? false,
          nextCursor: pageInfo?.endCursor
        },
        options
      )
    );
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

export async function getDeparturesGrouped(
  id: string[] | string,
  options: DepartureGroupsQuery,
  favorites?: FavoriteDeparture[]
): Promise<Result<DepartureGroupMetadata, APIError>> {
  const ids = Array.isArray(id) ? id : [id];

  const variables: GroupsByIdQueryVariables = {
    ids,
    timeRange: 86400 * 2, // Two days
    startTime: options.startTime,
    limitPerLine: options.limitPerLine,
    totalLimit: options.limitPerLine * 10,
    filterByLineIds: favorites?.map(f => f.lineId)
  };

  const result = await client.query<GroupsByIdQuery, GroupsByIdQueryVariables>({
    query: GroupsByIdDocument,
    variables
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  try {
    const data = mapQueryToGroups(result.data.stopPlaces, favorites);
    return Result.ok(generateCursorData(data, { hasNextPage: false }, options));
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

type Notice = { text?: string };
type Situation = {
  situationNumber?: string;
  reportType?: ReportType;
  summary: Array<{
    language?: string;
    value?: string;
  }>;
  description: Array<{
    language?: string;
    value?: string;
  }>;
  advice: Array<{
    language?: string;
    value?: string;
  }>;
  validityPeriod?: {
    startTime?: any;
    endTime?: any;
  };
  infoLinks?: Array<{ uri?: string; label?: string }>;
};

type DepartureLineInfo = {
  lineName: string;
  lineNumber: string;
  quayId: string;
  notices: Notice[];
  lineId: string;
};

type DepartureTime = {
  time: string;
  aimedTime: string;
  realtime?: boolean;
  situations: Situation[];
  serviceJourneyId?: string;
};

type DepartureGroup = {
  lineInfo?: DepartureLineInfo;
  departures: DepartureTime[];
};

type StopPlaceInfo = {
  id: string;
  description?: string | undefined;
  name: string;
  latitude?: number | undefined;
  longitude?: number | undefined;
};

type QuayInfo = {
  id: string;
  name: string;
  description?: string | undefined;
  publicCode?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  situations: Situation[];
};

type QuayGroup = {
  quay: QuayInfo;
  group: DepartureGroup[];
};

type StopPlaceGroup = {
  stopPlace: StopPlaceInfo;
  quays: QuayGroup[];
};

function toKey(lineId?: string, frontText?: String) {
  return [lineId ?? '', frontText ?? ''].join('-&-');
}

function mapQueryToGroups(
  stopPlaces?: GroupsByIdQuery['stopPlaces'],
  favorites?: FavoriteDeparture[]
): StopPlaceGroup[] {
  if (!stopPlaces) {
    return [];
  }

  const isFavorite = (item: DepartureLineInfo) =>
    !favorites ||
    favorites.some(
      f => item.lineName === f.lineName && item.lineId === f.lineId
    );

  return stopPlaces.filter(Boolean).map(function (stopPlace) {
    const { quays, ...stopPlaceInfo } = stopPlace;
    const quayGroups =
      quays?.map(function (quay) {
        const { times, estimatedCalls, ...quayInfo } = quay;
        const groups = groupBy(times, item =>
          toKey(
            item.serviceJourney?.line.id,
            item.destinationDisplay?.frontText
          )
        );
        const lineInfoGroups = groupBy(estimatedCalls, item =>
          toKey(
            item.serviceJourney?.line.id,
            item.destinationDisplay?.frontText
          )
        );

        let lines: QuayGroup['group'] = [];

        for (let [lineGroup, times] of Object.entries(groups)) {
          const lineInfoEntry = lineInfoGroups[lineGroup]?.[0];
          if (!lineInfoEntry) {
            continue;
          }

          const lineInfo: DepartureLineInfo = {
            lineName: lineInfoEntry.destinationDisplay?.frontText ?? '',
            lineNumber: lineInfoEntry.serviceJourney?.line.publicCode ?? '',
            quayId: quay.id,
            notices: (lineInfoEntry.notices as Notice[]) ?? [],
            lineId: lineInfoEntry.serviceJourney?.line.id ?? ''
          };

          if (!isFavorite(lineInfo)) {
            continue;
          }

          const departures = times.map<DepartureTime>(function (time) {
            return {
              time: time.expectedArrivalTime,
              aimedTime: time.aimedArrivalTime,
              realtime: time.realtime,
              situations: time.situations,
              serviceJourneyId: time.serviceJourney?.id
            };
          });

          lines.push({
            lineInfo,
            departures
          });
        }

        return {
          quay: quayInfo,
          group: lines
        };
      }) ?? [];

    return {
      stopPlace: stopPlaceInfo,
      quays: quayGroups
    };
  });
}
