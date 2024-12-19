import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { ServiceJourneyWithEstCallsFragment } from '../../fragments/journey-gql/service-journey.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { ServiceJourneyWithEstCallsFragmentDoc } from '../../fragments/journey-gql/service-journey.graphql-gen';
export type ServiceJourneyWithEstimatedCallsQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  date?: Types.InputMaybe<Types.Scalars['Date']['input']>;
}>;


export type ServiceJourneyWithEstimatedCallsQuery = { serviceJourney?: ServiceJourneyWithEstCallsFragment };


export const ServiceJourneyWithEstimatedCallsDocument = gql`
    query serviceJourneyWithEstimatedCalls($id: String!, $date: Date) {
  serviceJourney(id: $id) {
    ...serviceJourneyWithEstCalls
  }
}
    ${ServiceJourneyWithEstCallsFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    serviceJourneyWithEstimatedCalls(variables: ServiceJourneyWithEstimatedCallsQueryVariables, options?: C): Promise<ServiceJourneyWithEstimatedCallsQuery> {
      return requester<ServiceJourneyWithEstimatedCallsQuery, ServiceJourneyWithEstimatedCallsQueryVariables>(ServiceJourneyWithEstimatedCallsDocument, variables, options) as Promise<ServiceJourneyWithEstimatedCallsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;