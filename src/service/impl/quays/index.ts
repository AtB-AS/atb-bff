import { Result } from '@badrap/result';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
import { IQuayService } from '../../interface';
import { APIError, QuaysCoordinatesPayload } from '../../types';
import {
  GetQuaysCoordinatesQuery,
  GetQuaysCoordinatesDocument,
  GetQuaysCoordinatesQueryVariables
} from './jp3/quay.graphql-gen';

export default (): IQuayService => {
  const api: IQuayService = {
    async getQuaysCoordinates(
      payload: QuaysCoordinatesPayload
    ): Promise<Result<GetQuaysCoordinatesQuery, APIError>> {
      const result = await journeyPlannerClient_v3.query<
        GetQuaysCoordinatesQuery,
        GetQuaysCoordinatesQueryVariables
      >({
        query: GetQuaysCoordinatesDocument,
        variables: {
          ids: payload.ids
        }
      });

      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }

      try {
        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };

  return api;
};
