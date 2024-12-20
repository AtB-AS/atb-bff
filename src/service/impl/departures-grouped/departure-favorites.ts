import {Result} from '@badrap/result';
import union from 'lodash.union';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {CursoredData, generateCursorData} from '../../cursored';
import {DepartureFavoritesQuery, FavoriteDeparture} from '../../types';
import {APIError} from '../../../utils/api-error';
import {
  GroupsByIdDocument,
  GroupsByIdQuery,
  GroupsByIdQueryVariables,
} from './journey-gql/departure-group.graphql-gen';
import mapQueryToGroups, {StopPlaceGroup} from './utils/grouping';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {onlyUniques} from '../stop-places/utils';

export type DepartureFavoritesMetadata = CursoredData<StopPlaceGroup[]>;

export async function getDepartureFavorites(
  options: DepartureFavoritesQuery,
  headers: Request<ReqRefDefaults>,
  favorites: FavoriteDeparture[],
): Promise<Result<DepartureFavoritesMetadata, APIError>> {
  const quayIds = favorites?.map((f) => f.quayId).filter(onlyUniques);

  const variables: GroupsByIdQueryVariables = {
    ids: quayIds,
    timeRange: 86400 * 2, // Two days
    startTime: options.startTime,
    limitPerLine: options.limitPerLine,
    totalLimit: options.limitPerLine * 10,
    filterByLineIds: favorites.map((f) => f.lineId),
    includeCancelledTrips: options.includeCancelledTrips,
  };

  const result = await journeyPlannerClient(headers).query<
    GroupsByIdQuery,
    GroupsByIdQueryVariables
  >({
    query: GroupsByIdDocument,
    variables,
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  try {
    const data = mapQueryToGroups(result.data.quays, favorites);
    return Result.ok(generateCursorData(data, {hasNextPage: false}, options));
  } catch (error) {
    return Result.err(new APIError(error));
  }
}
