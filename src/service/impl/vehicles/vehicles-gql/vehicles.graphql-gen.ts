import * as Types from '../../../../graphql/vehicles/vehicles-types_v1';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetVehiclesDataQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
}>;


export type GetVehiclesDataQuery = { vehicles?: Array<{ lastUpdated?: any, bearing?: number, mode?: Types.VehicleModeEnumeration, location?: { latitude: number, longitude: number }, serviceJourney?: { id: string } }> };


export const GetVehiclesDataDocument = gql`
    query getVehiclesData($serviceJourneyId: String!) {
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
    getVehiclesData(variables: GetVehiclesDataQueryVariables, options?: C): Promise<GetVehiclesDataQuery> {
      return requester<GetVehiclesDataQuery, GetVehiclesDataQueryVariables>(GetVehiclesDataDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;