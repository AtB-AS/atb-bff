import {Result} from '@badrap/result';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {IRealtimeService} from '../../interface';
import {APIError, DepartureRealtimeQuery} from '../../types';
import {
  createVariables,
  getPreviousExpectedFromCache,
  mapToDepartureRealtime,
} from './departure-time';
import {
  GetDepartureRealtimeDocument,
  GetDepartureRealtimeQuery,
  GetDepartureRealtimeQueryVariables,
} from './journey-gql/departure-time.graphql-gen';

export default (): IRealtimeService => {
  const api: IRealtimeService = {
    async getDepartureRealtime(query: DepartureRealtimeQuery, headers) {
      try {
        const variables = createVariables(query);
        const previousResult = getPreviousExpectedFromCache(variables, headers);
        const result = await journeyPlannerClient(headers).query<
          GetDepartureRealtimeQuery,
          GetDepartureRealtimeQueryVariables
        >({
          query: GetDepartureRealtimeDocument,
          variables,
          // With fetch policy set to `network-only`, apollo client will always
          // fetch and return new data, then update the cache afterwards.
          fetchPolicy: 'network-only',
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        const mapped = mapToDepartureRealtime(result.data, previousResult);
        return Result.ok(mapped);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };

  return api;
};
