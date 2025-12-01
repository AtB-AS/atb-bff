import * as Types from '../../../../graphql/vehicles/vehicles-types_v2';

import { VehicleFragment } from '../../fragments/vehicles-gql/vehicle.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleFragmentDoc } from '../../fragments/vehicles-gql/vehicle.graphql-gen';
export type GetServiceJourneyVehicleQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String']['input'];
}>;


export type GetServiceJourneyVehicleQuery = { vehicles?: Array<VehicleFragment> };


export const GetServiceJourneyVehicleDocument = gql`
    query getServiceJourneyVehicle($serviceJourneyId: String!) {
  vehicles(serviceJourneyId: $serviceJourneyId) {
    ...vehicle
  }
}
    ${VehicleFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getServiceJourneyVehicle(variables: GetServiceJourneyVehicleQueryVariables, options?: C): Promise<GetServiceJourneyVehicleQuery> {
      return requester<GetServiceJourneyVehicleQuery, GetServiceJourneyVehicleQueryVariables>(GetServiceJourneyVehicleDocument, variables, options) as Promise<GetServiceJourneyVehicleQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;