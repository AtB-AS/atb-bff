import * as Types from '../../../../graphql/vehicles/vehicles-types_v1';

import { VehicleFragment } from '../../fragments/vehicles-gql/vehicle.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleFragmentDoc } from '../../fragments/vehicles-gql/vehicle.graphql-gen';
export type ServiceJourneySubscriptionVariables = Types.Exact<{
  serviceJourneyId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ServiceJourneySubscription = { vehicles?: Array<VehicleFragment> };


export const ServiceJourneyDocument = gql`
    subscription ServiceJourney($serviceJourneyId: String) {
  vehicles(serviceJourneyId: $serviceJourneyId, bufferTime: 500) {
    ...Vehicle
  }
}
    ${VehicleFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    ServiceJourney(variables?: ServiceJourneySubscriptionVariables, options?: C): AsyncIterable<ServiceJourneySubscription> {
      return requester<ServiceJourneySubscription, ServiceJourneySubscriptionVariables>(ServiceJourneyDocument, variables, options) as AsyncIterable<ServiceJourneySubscription>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;