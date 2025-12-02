import {IVehiclesService} from '../../interface';
import {Result} from '@badrap/result';
import {APIError} from '../../../utils/api-error';
import {
  vehiclesClient,
  vehiclesSubscriptionClient,
} from '../../../graphql/graphql-client';
import {
  GetVehicleUpdateDocument,
  GetVehicleUpdateQuery,
  GetVehicleUpdateQueryVariables,
} from './vehicles-gql/vehicle-update.graphql-gen';
import {
  VehicleUpdateDocument,
  VehicleUpdateSubscription,
} from './vehicles-gql/vehicle-update-subscription.graphql-gen';
import {isDefined} from '../stop-places/utils';

export default (): IVehiclesService => ({
  async getVehicleUpdate(query, request) {
    try {
      const results = query.serviceJourneyIds.map((id) => {
        return vehiclesClient(request).query<
          GetVehicleUpdateQuery,
          GetVehicleUpdateQueryVariables
        >({
          query: GetVehicleUpdateDocument,
          variables: {
            serviceJourneyId: id,
          },
        });
      });

      const result = await Promise.all(results);

      const errors = result.find((res) => res.errors);
      if (errors) {
        return Result.err(new APIError(errors));
      }

      const vehiclesData = result
        .flatMap((v) => v.data.vehicles)
        .filter(isDefined);

      return Result.ok(vehiclesData);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  createVehicleUpdateSubscription(query, ws) {
    return vehiclesSubscriptionClient
      .subscribe({
        query: VehicleUpdateDocument,
        fetchPolicy: 'no-cache',
        variables: query,
      })
      .subscribe({
        next: (value) => {
          const data = value.data as VehicleUpdateSubscription;
          const vehicle = data.vehicles?.find(
            (v) => v.serviceJourney?.id === query.serviceJourneyId,
          );
          if (!vehicle) return;
          ws.send(JSON.stringify(vehicle));
        },
      });
  },
});
