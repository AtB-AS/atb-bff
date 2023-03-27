import { IVehiclesService } from '../../interface';
import { Result } from '@badrap/result';
import { APIError, GetVehiclesData } from '../../types';
import {
  GetVehiclesDataDocument,
  GetVehiclesDataQuery,
  GetVehiclesDataQueryVariables
} from './vehicles-gql/vehicles.graphql-gen';
import { vehiclesClient } from '../../../graphql/graphql-client';

export default (): IVehiclesService => ({
  async getVehiclesData(query) {
    try {
      const results = query.serviceJourneyIds.map(id => {
        return vehiclesClient.query<
          GetVehiclesDataQuery,
          GetVehiclesDataQueryVariables
        >({
          query: GetVehiclesDataDocument,
          variables: {
            serviceJourneyId: id
          }
        });
      });

      const result = await Promise.all(results);

      const errors = result.find(res => res.errors);
      if (errors) {
        return Result.err(new APIError(errors));
      }

      const vehiclesData = result
        .flatMap(v => v.data.vehicles)
        .filter(Boolean) as GetVehiclesData;

      return Result.ok(vehiclesData);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  }
});
