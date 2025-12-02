import * as Types from '../../../../graphql/vehicles/vehicles-types_v2';

import { VehicleUpdateFragment } from '../../fragments/vehicles-gql/vehicle-update.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleUpdateFragmentDoc } from '../../fragments/vehicles-gql/vehicle-update.graphql-gen';
export type GetVehicleUpdateQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String']['input'];
}>;


export type GetVehicleUpdateQuery = { vehicles?: Array<VehicleUpdateFragment> };


export const GetVehicleUpdateDocument = gql`
    query getVehicleUpdate($serviceJourneyId: String!) {
  vehicles(serviceJourneyId: $serviceJourneyId) {
    ...vehicleUpdate
  }
}
    ${VehicleUpdateFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getVehicleUpdate(variables: GetVehicleUpdateQueryVariables, options?: C): Promise<GetVehicleUpdateQuery> {
      return requester<GetVehicleUpdateQuery, GetVehicleUpdateQueryVariables>(GetVehicleUpdateDocument, variables, options) as Promise<GetVehicleUpdateQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;