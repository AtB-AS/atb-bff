import { Result } from '@badrap/result';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
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
  QuayIdInStopsDocument,
  QuayIdInStopsQuery,
  QuayIdInStopsQueryVariables
} from '../departure-favorites/journey-gql/jp3/departure-group.graphql-gen';
import {
  GroupsByNearestDocument,
  GroupsByNearestQuery,
  GroupsByNearestQueryVariables
} from './journey-gql/jp3/departure-group.graphql-gen';
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
    const quayIdsResult = await journeyPlannerClient_v3.query<
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

  const result = await journeyPlannerClient_v3.query<
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
  let ids = Array.isArray(id) ? id : [id];

  const variables: GroupsByIdQueryVariables = {
    ids,
    timeRange: 86400 * 2, // Two days
    startTime: options.startTime,
    limitPerLine: options.limitPerLine,
    totalLimit: options.limitPerLine * 10,
    filterByLineIds: favorites?.map(f => f.lineId)
  };

  const result = await journeyPlannerClient_v3.query<
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
