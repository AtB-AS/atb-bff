import { IVehiclesService } from '../../interface';
import { Result } from '@badrap/result';
import { APIError, GetServiceJourneyVehicles } from '../../types';
import {
  vehiclesClient,
  vehiclesSubscriptionClient
} from '../../../graphql/graphql-client';
import {
  GetServiceJourneyVehicleDocument,
  GetServiceJourneyVehicleQuery,
  GetServiceJourneyVehicleQueryVariables
} from './vehicles-gql/vehicles.graphql-gen';
import { ServiceJourneyDocument } from './vehicles-gql/service-journey-subscription.graphql-gen';

export default (): IVehiclesService => ({
  async getServiceJourneyVehicles(query) {
    try {
      const results = query.serviceJourneyIds.map(id => {
        return vehiclesClient.query<
          GetServiceJourneyVehicleQuery,
          GetServiceJourneyVehicleQueryVariables
        >({
          query: GetServiceJourneyVehicleDocument,
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
        .filter(Boolean) as GetServiceJourneyVehicles;

      return Result.ok(vehiclesData);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  createServiceJourneySubscription(query, ws) {
    return vehiclesSubscriptionClient
      .subscribe({
        query: ServiceJourneyDocument,
        variables: query
      })
      .subscribe({
        next: value => ws.send(JSON.stringify(value.data)),
        complete: console.log,
        error: console.error,
        start: console.log
      });
  }
});
