import { Result } from '@badrap/result';
import union from 'lodash.union';
import { journeyPlannerClient } from '../../../graphql/graphql-client';
import { CursoredData, generateCursorData } from '../../cursored';
import { APIError, DepartureGroupsQuery, FavoriteDeparture } from '../../types';
import { populateRealtimeCacheIfNotThere } from '../realtime/departure-time';
import {
  GroupsByIdDocument,
  GroupsByIdQuery,
  GroupsByIdQueryVariables
} from './journey-gql/departure-group.graphql-gen';
import mapQueryToGroups, { StopPlaceGroup } from './utils/grouping';

export type DepartureFavoritesMetadata = CursoredData<StopPlaceGroup[]>;

export async function getDepartureFavorites(
  options: DepartureGroupsQuery,
  favorites?: FavoriteDeparture[]
): Promise<Result<DepartureFavoritesMetadata, APIError>> {
  const stopIds = union(favorites?.map(f => f.stopId));

  const variables: GroupsByIdQueryVariables = {
    ids: stopIds,
    timeRange: 86400 * 2, // Two days
    startTime: options.startTime,
    limitPerLine: options.limitPerLine,
    totalLimit: options.limitPerLine * 10,
    filterByLineIds: favorites?.map(f => f.lineId),
    includeCancelledTrips: options.includeCancelledTrips
  };

  const quayIds = union(favorites?.map(f => f.quayId)).filter(
    Boolean
  ) as string[];
  const lineIds = union(favorites?.map(f => f.lineId));
  // Fire and forget population of cache. Not critial if it fails.
  populateRealtimeCacheIfNotThere({
    limit: 100,
    startTime: options.startTime,
    limitPerLine: options.limitPerLine,
    quayIds,
    lineIds
  });

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
