import {Result} from '@badrap/result';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {IRealtimeService} from '../../interface';
import {DepartureRealtimeQuery} from '../../types';
import {APIError} from '../../../utils/api-error';
import {mapToDepartureRealtime} from './departure-time';
import {
  GetDepartureRealtimeDocument,
  GetDepartureRealtimeQuery,
  GetDepartureRealtimeQueryVariables,
} from './journey-gql/departure-time.graphql-gen';
import {sanitizeRealtimeQuery} from './sanitize-realtime-query';

export default (): IRealtimeService => {
  return {
    async getDepartureRealtime(query: DepartureRealtimeQuery, headers) {
      try {
        const variables = sanitizeRealtimeQuery(query);
        if (!variables) return Result.ok({});

        const result = await journeyPlannerClient(headers).query<
          GetDepartureRealtimeQuery,
          GetDepartureRealtimeQueryVariables
        >({
          query: GetDepartureRealtimeDocument,
          variables,
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        const mapped = mapToDepartureRealtime(result.data);
        return Result.ok(mapped);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
