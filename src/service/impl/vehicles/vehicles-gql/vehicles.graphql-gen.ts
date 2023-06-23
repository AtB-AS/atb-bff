import * as Types from '../../../../graphql/vehicles/vehicles-types_v1';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetServiceJourneyVehicleQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
}>;


export type GetServiceJourneyVehicleQuery = { vehicles?: Array<{ lastUpdated?: any, bearing?: number, mode?: Types.VehicleModeEnumeration, vehicleStatus?: Types.VehicleStatusEnumeration, location?: { latitude: number, longitude: number }, serviceJourney?: { id: string } }> };


export const GetServiceJourneyVehicleDocument = gql`
    query getServiceJourneyVehicle($serviceJourneyId: String!) {
  vehicles(serviceJourneyId: $serviceJourneyId) {
    lastUpdated
    location {
      latitude
      longitude
    }
    bearing
    mode
    serviceJourney {
      id
    }
    vehicleStatus
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getServiceJourneyVehicle(variables: GetServiceJourneyVehicleQueryVariables, options?: C): Promise<GetServiceJourneyVehicleQuery> {
      return requester<GetServiceJourneyVehicleQuery, GetServiceJourneyVehicleQueryVariables>(GetServiceJourneyVehicleDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;