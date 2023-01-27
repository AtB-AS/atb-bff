import { IMobilityService } from '../../interface';
import { Result } from '@badrap/result';
import { APIError } from '../../types';
import { mobilityClient } from '../../../graphql/graphql-client';
import {
  GetVehiclesDocument,
  GetVehiclesQuery,
  GetVehiclesQueryVariables
} from './mobility-gql/vehicles.graphql-gen';

const calculateFuelPercent = (data: GetVehiclesQuery): GetVehiclesQuery => ({
  ...data,
  vehicles: data?.vehicles?.map(vehicle => ({
    ...vehicle,
    currentFuelPercent: vehicle.currentFuelPercent
        ? vehicle.currentFuelPercent
        : vehicle.vehicleType.maxRangeMeters
            ? Math.floor((vehicle.currentRangeMeters / vehicle.vehicleType.maxRangeMeters) * 100)
            : undefined
  }))
});

export default (): IMobilityService => {
  const api: IMobilityService = {
    async getVehicles(query) {
      try {
        const result = await mobilityClient.query<
          GetVehiclesQuery,
          GetVehiclesQueryVariables
        >({
          query: GetVehiclesDocument,
          variables: query
        });
        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        return Result.ok(calculateFuelPercent(result.data));
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };
  return api;
};
