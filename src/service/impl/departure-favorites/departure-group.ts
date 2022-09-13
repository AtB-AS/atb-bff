import { Result } from '@badrap/result';
import union from 'lodash.union';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
import { CursoredData, generateCursorData } from '../../cursored';
import { APIError, DepartureGroupsQuery, FavoriteDeparture } from '../../types';
import {
  GroupsByIdDocument,
  GroupsByIdQuery,
  GroupsByIdQueryVariables
} from './journey-gql/jp3/departure-group.graphql-gen';
import mapQueryToGroups, { StopPlaceGroup } from './utils/grouping';

export type DepartureFavoritesMetadata = CursoredData<StopPlaceGroup[]>;

export async function getDepartureFavorites(
  options: DepartureGroupsQuery,
  favorites?: FavoriteDeparture[]
): Promise<Result<DepartureFavoritesMetadata, APIError>> {
  const ids = union(favorites?.map(f => f.stopId));

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
