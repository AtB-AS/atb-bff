import { Result } from '@badrap/result';
import {
  journeyPlannerClient,
  stopPlacesClient
} from '../../../graphql/graphql-client';
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
} from './journey-gql/departure-group.graphql-gen';
import {
  QuaysInMultimodalDocument,
  QuaysInMultimodalQuery,
  QuaysInMultimodalQueryVariables
} from './stops-gql/multimodal-stops.graphql-gen';
import mapQueryToGroups, { StopPlaceGroup } from './utils/grouping';

export type DepartureGroupMetadata = CursoredData<StopPlaceGroup[]>;

export async function getDeparturesGroupedNearest(
  coordinates: Coordinates,
  distance: number = 1000,
  options: DepartureGroupsQuery,
  favorites?: FavoriteDeparture[]
): Promise<Result<DepartureGroupMetadata, APIError>> {
  let favoriteQuayIds: string[] | undefined = undefined;
  if (favorites?.length) {
    const quayIdsResult = await journeyPlannerClient.query<
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

  const result = await journeyPlannerClient.query<
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
  let ids = await multiModalStopsToNormalStops(Array.isArray(id) ? id : [id]);

  const variables: GroupsByIdQueryVariables = {
    ids,
    timeRange: 86400 * 2, // Two days
    startTime: options.startTime,
    limitPerLine: options.limitPerLine,
    totalLimit: options.limitPerLine * 10,
    filterByLineIds: favorites?.map(f => f.lineId)
  };

  const result = await journeyPlannerClient.query<
    GroupsByIdQuery,
    GroupsByIdQueryVariables
  >({
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

async function multiModalStopsToNormalStops(ids: string[]) {
  // Some stops can be multi modal, meaningstops can have children
  // stops which again has quays. This checks if given stop is multimodal
  // and if it is, fetch all other stops that are
  // children of that stop place _or_ the parent stop place..
  const expandedMultiModalStops = await Promise.all(
    ids.map(async function (stopId) {
      const potentialChildrenResult = await stopPlacesClient.query<
        QuaysInMultimodalQuery,
        QuaysInMultimodalQueryVariables
      >({
        query: QuaysInMultimodalDocument,
        variables: { stopId }
      });

      // If no data or error, just treat it as normal stop place.
      // Data will stil show but not perfectly.
      const data = potentialChildrenResult.data?.stopPlace;
      if (potentialChildrenResult.errors || !data) {
        return [stopId];
      }

      // Find all children or just default to itself.
      const ret = (data[0]?.children
        ?.map(c => c.id)
        .filter(Boolean) as string[]) ?? [stopId];
      return ret;
    })
  );

  return expandedMultiModalStops.flat();
}
