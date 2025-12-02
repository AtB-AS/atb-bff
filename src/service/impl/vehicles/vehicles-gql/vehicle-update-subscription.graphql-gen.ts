import * as Types from '../../../../graphql/vehicles/vehicles-types_v2';

import { VehicleUpdateFragment } from '../../fragments/vehicles-gql/vehicle-update.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleUpdateFragmentDoc } from '../../fragments/vehicles-gql/vehicle-update.graphql-gen';
export type VehicleUpdateSubscriptionVariables = Types.Exact<{
  serviceJourneyId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type VehicleUpdateSubscription = { vehicles?: Array<VehicleUpdateFragment> };


export const VehicleUpdateDocument = gql`
    subscription VehicleUpdate($serviceJourneyId: String) {
  vehicles(serviceJourneyId: $serviceJourneyId, bufferTime: 500) {
    ...vehicleUpdate
  }
}
    ${VehicleUpdateFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    VehicleUpdate(variables?: VehicleUpdateSubscriptionVariables, options?: C): AsyncIterable<VehicleUpdateSubscription> {
      return requester<VehicleUpdateSubscription, VehicleUpdateSubscriptionVariables>(VehicleUpdateDocument, variables, options) as AsyncIterable<VehicleUpdateSubscription>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;