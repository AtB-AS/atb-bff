import * as Types from '../../../../graphql/vehicles/vehicles-types_v1';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetServiceJourneyVehiclesQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
}>;


export type GetServiceJourneyVehiclesQuery = { vehicles?: Array<{ lastUpdated?: any, bearing?: number, mode?: Types.VehicleModeEnumeration, location?: { latitude: number, longitude: number }, serviceJourney?: { id: string } }> };


export const GetServiceJourneyVehiclesDocument = gql`
    query getServiceJourneyVehicles($serviceJourneyId: String!) {
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
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getServiceJourneyVehicles(variables: GetServiceJourneyVehiclesQueryVariables, options?: C): Promise<GetServiceJourneyVehiclesQuery> {
      return requester<GetServiceJourneyVehiclesQuery, GetServiceJourneyVehiclesQueryVariables>(GetServiceJourneyVehiclesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;