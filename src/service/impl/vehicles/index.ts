import {IVehiclesService} from '../../interface';
import {Result} from '@badrap/result';
import {GetServiceJourneyVehicles} from '../../types';
import {APIError} from '../../../utils/api-error';
import {
  vehiclesClient,
  vehiclesSubscriptionClient,
} from '../../../graphql/graphql-client';
import {
  GetServiceJourneyVehicleDocument,
  GetServiceJourneyVehicleQuery,
  GetServiceJourneyVehicleQueryVariables,
} from './vehicles-gql/vehicles.graphql-gen';
import {
  ServiceJourneyDocument,
  ServiceJourneySubscription,
} from './vehicles-gql/service-journey-subscription.graphql-gen';
import {createStaleVehicleUpdateFilter} from './utils';

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
    const pickNewestVehicleUpdate = createStaleVehicleUpdateFilter();
    return vehiclesSubscriptionClient
      .subscribe({
        query: ServiceJourneyDocument,
        fetchPolicy: 'no-cache',
        variables: query,
      })
      .subscribe({
        next: (value) => {
          const data = value.data as ServiceJourneySubscription;
          // Updates can arrive out of order, so discard those that are older
          // than the newest one already seen.
          const vehicle = pickNewestVehicleUpdate(
            data.vehicles?.filter(
              (v) => v.serviceJourney?.id === query.serviceJourneyId,
            ) ?? [],
          );
          if (!vehicle) return;
          ws.send(JSON.stringify(vehicle));
        },
      });
  },
});
