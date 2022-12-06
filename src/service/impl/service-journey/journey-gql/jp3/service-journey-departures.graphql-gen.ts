import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../../fragments/jp3/notices.graphql-gen';
import { QuayWithSituationsFragmentDoc } from '../../../fragments/jp3/quays.graphql-gen';
import { SituationFragmentDoc } from '../../../fragments/jp3/situations.graphql-gen';
export type ServiceJourneyDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  date?: Types.InputMaybe<Types.Scalars['Date']>;
}>;


export type ServiceJourneyDeparturesQuery = { serviceJourney?: { estimatedCalls?: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ id: string, text?: string }>, quay?: { id: string, name: string, publicCode?: string, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> }, serviceJourney?: { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }> }> } };

export type ServiceJourneyEstimatedCallFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ id: string, text?: string }>, quay?: { id: string, name: string, publicCode?: string, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> }, serviceJourney?: { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }> };

export type LineFragment = { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode };

export type ServiceJourneyFragment = { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } };

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
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    serviceJourneyDepartures(variables: ServiceJourneyDeparturesQueryVariables, options?: C): Promise<ServiceJourneyDeparturesQuery> {
      return requester<ServiceJourneyDeparturesQuery, ServiceJourneyDeparturesQueryVariables>(ServiceJourneyDeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;