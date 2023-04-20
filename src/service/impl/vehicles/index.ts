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
import gql from 'graphql-tag';

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
  createServiceJourneyVehicleSubscription(query, ws) {
    return vehiclesSubscriptionClient
      .subscribe({
        query: VEHICLE_UPDATES_SUBSCRIPTION,
        fetchPolicy: 'no-cache',
        variables: {
          serviceJourneyId: query.serviceJourneyId,
          includePointsOnLink: false
        }
      })
      .subscribe({
        next: value => ws.send(JSON.stringify(value.data)),
        complete: console.log,
        error: console.error,
        start: console.log
      });
  }
});

export const VEHICLE_FRAGMENT = gql`
  fragment VehicleFragment on VehicleUpdate {
    serviceJourney {
      id
    }
    mode
    lastUpdated
    lastUpdatedEpochSecond
    monitored
    bearing
    location {
      latitude
      longitude
    }
  }
`;
export const VEHICLE_UPDATES_SUBSCRIPTION = gql`
  subscription VehicleUpdates($serviceJourneyId: String, $monitored: Boolean) {
    vehicleUpdates(serviceJourneyId: $serviceJourneyId, monitored: $monitored) {
      ...VehicleFragment
    }
  }
  ${VEHICLE_FRAGMENT}
`;
