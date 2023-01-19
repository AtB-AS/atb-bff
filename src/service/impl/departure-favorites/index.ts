import { IDepartureFavoritesService } from '../../interface';
import { Result } from '@badrap/result';
import union from 'lodash.union';
import { journeyPlannerClient } from '../../../graphql/graphql-client';
import { CursoredData, generateCursorData } from '../../cursored';
import { APIError } from '../../types';
import {
  GroupsByIdDocument,
  GroupsByIdQuery,
  GroupsByIdQueryVariables
} from './journey-gql/departure-group.graphql-gen';
import mapQueryToGroups, { StopPlaceGroup } from './utils/grouping';

export type DepartureFavoritesMetadata = CursoredData<StopPlaceGroup[]>;

export default (): IDepartureFavoritesService => {
  const api: IDepartureFavoritesService = {
    async getDeparturesFavorites(payload, query) {
      const favorites = payload.favorites;
      const ids = union(favorites?.map(f => f.stopId));

      const variables: GroupsByIdQueryVariables = {
        ids,
        timeRange: 86400 * 2, // Two days
        startTime: query.startTime,
        limitPerLine: query.limitPerLine,
        totalLimit: query.limitPerLine * 10,
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
        return Result.ok(
          generateCursorData(data, { hasNextPage: false }, query)
        );
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };

  return api;
};
