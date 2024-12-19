import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { NoticeFragment } from '../../fragments/journey-gql/notices.graphql-gen';
import { QuayWithSituationsFragment } from '../../fragments/journey-gql/quays.graphql-gen';
import { SituationFragment } from '../../fragments/journey-gql/situations.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { QuayWithSituationsFragmentDoc } from '../../fragments/journey-gql/quays.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
export type ServiceJourneyDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  date?: Types.InputMaybe<Types.Scalars['Date']['input']>;
}>;


export type ServiceJourneyDeparturesQuery = { serviceJourney?: { estimatedCalls?: Array<ServiceJourneyEstimatedCallFragment> } };

export type ServiceJourneyEstimatedCallFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<NoticeFragment>, quay: QuayWithSituationsFragment, serviceJourney: ServiceJourneyFragment, situations: Array<SituationFragment> };

export type LineFragment = { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode };

export type ServiceJourneyFragment = { id: string, journeyPattern?: { line: LineFragment } };

export const LineFragmentDoc = gql`
    fragment line on Line {
  id
  name
  publicCode
  transportMode
  transportSubmode
}
    `;
export const ServiceJourneyFragmentDoc = gql`
    fragment serviceJourney on ServiceJourney {
  id
  journeyPattern {
    line {
      ...line
    }
  }
}
    ${LineFragmentDoc}`;
export const ServiceJourneyEstimatedCallFragmentDoc = gql`
    fragment serviceJourneyEstimatedCall on EstimatedCall {
  actualArrivalTime
  actualDepartureTime
  aimedArrivalTime
  aimedDepartureTime
  cancellation
  date
  destinationDisplay {
    frontText
  }
  expectedDepartureTime
  expectedArrivalTime
  forAlighting
  notices {
    ...notice
  }
  quay {
    ...quayWithSituations
  }
  realtime
  serviceJourney {
    ...serviceJourney
  }
  situations {
    ...situation
  }
}
    ${NoticeFragmentDoc}
${QuayWithSituationsFragmentDoc}
${ServiceJourneyFragmentDoc}
${SituationFragmentDoc}`;
export const ServiceJourneyDeparturesDocument = gql`
    query serviceJourneyDepartures($id: String!, $date: Date) {
  serviceJourney(id: $id) {
    estimatedCalls(date: $date) {
      ...serviceJourneyEstimatedCall
    }
  }
}
    ${ServiceJourneyEstimatedCallFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    serviceJourneyDepartures(variables: ServiceJourneyDeparturesQueryVariables, options?: C): Promise<ServiceJourneyDeparturesQuery> {
      return requester<ServiceJourneyDeparturesQuery, ServiceJourneyDeparturesQueryVariables>(ServiceJourneyDeparturesDocument, variables, options) as Promise<ServiceJourneyDeparturesQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;