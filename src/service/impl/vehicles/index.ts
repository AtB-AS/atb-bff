import {IVehiclesService} from '../../interface';
import {Result} from '@badrap/result';
import {GetServiceJourneyVehicles} from '../../types';
import {APIError} from '../../../utils/api-error';
import {vehiclesClient} from '../../../graphql/graphql-client';
import {
  GetServiceJourneyVehicleDocument,
  GetServiceJourneyVehicleQuery,
  GetServiceJourneyVehicleQueryVariables,
} from './vehicles-gql/vehicles.graphql-gen';
import {vehicleSubscriptionPool} from './subscription-pool';
import {Subscription} from 'zen-observable-ts';

export default (): IVehiclesService => ({
  async getServiceJourneyVehicles(query, request) {
    try {
      const results = query.serviceJourneyIds.map((id) => {
        return vehiclesClient(request).query<
          GetServiceJourneyVehicleQuery,
          GetServiceJourneyVehicleQueryVariables
        >({
          query: GetServiceJourneyVehicleDocument,
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
        .filter(Boolean) as GetServiceJourneyVehicles;

      return Result.ok(vehiclesData);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  createServiceJourneySubscription(query, ws) {
    vehicleSubscriptionPool.subscribe(query.serviceJourneyId, ws);
    return {
      unsubscribe: () => {
        vehicleSubscriptionPool.unsubscribe(query.serviceJourneyId, ws);
      },
      get closed() {
        return false;
      },
    } as Subscription;
  },
});
