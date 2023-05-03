import * as Types from '../../../../graphql/vehicles/vehicles-types_v1';

import { VehicleFragment } from '../../fragments/vehicles-gql/vehicle.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleFragmentDoc } from '../../fragments/vehicles-gql/vehicle.graphql-gen';
export type ServiceJourneySubscriptionVariables = Types.Exact<{
  serviceJourneyId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type ServiceJourneySubscription = { vehicles?: Array<VehicleFragment> };


export const ServiceJourneyDocument = gql`
    subscription ServiceJourney($serviceJourneyId: String) {
  vehicles(serviceJourneyId: $serviceJourneyId, bufferTime: 500) {
    ...Vehicle
  }
}
    ${VehicleFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    ServiceJourney(variables?: ServiceJourneySubscriptionVariables, options?: C): Promise<ServiceJourneySubscription> {
      return requester<ServiceJourneySubscription, ServiceJourneySubscriptionVariables>(ServiceJourneyDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;