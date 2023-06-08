import {Result} from '@badrap/result';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {IQuayService} from '../../interface';
import {APIError, QuaysCoordinatesPayload} from '../../types';
import {
  GetQuaysCoordinatesQuery,
  GetQuaysCoordinatesDocument,
  GetQuaysCoordinatesQueryVariables,
} from './journey-gql/quays-coordinates.graphql-gen';
import {ReqRefDefaults, Request} from '@hapi/hapi';

export default (): IQuayService => {
  const api: IQuayService = {
    async getQuaysCoordinates(
      payload: QuaysCoordinatesPayload,
      headers: Request<ReqRefDefaults>,
    ): Promise<Result<GetQuaysCoordinatesQuery, APIError>> {
      const result = await journeyPlannerClient(headers).query<
        GetQuaysCoordinatesQuery,
        GetQuaysCoordinatesQueryVariables
      >({
        query: GetQuaysCoordinatesDocument,
        variables: {
          ids: payload.ids,
        },
      });

      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }

      try {
        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };

  return api;
};
