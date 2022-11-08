import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type ServiceJourneyDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  date?: Types.InputMaybe<Types.Scalars['Date']>;
}>;


export type ServiceJourneyDeparturesQuery = { serviceJourney?: { estimatedCalls?: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay?: { id: string, name: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } }, serviceJourney?: { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }> }> } };

export type ServiceJourneyEstimatedCallFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay?: { id: string, name: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } }, serviceJourney?: { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }> };

export type NoticeFragment = { text?: string };

export type QuayFragment = { id: string, name: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } };

export type SituationFragment = { situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> };

export type LineFragment = { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode };

export type StopPlaceFragment = { id: string, name: string, latitude?: number, longitude?: number };

export type ServiceJourneyFragment = { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } };

export const NoticeFragmentDoc = gql`
    fragment notice on Notice {
  text
}
    `;
export const SituationFragmentDoc = gql`
    fragment situation on PtSituationElement {
  situationNumber
  summary {
    language
    value
  }
  description {
    language
    value
  }
  advice {
    language
    value
  }
  reportType
  infoLinks {
    uri
    label
  }
}
    `;
export const StopPlaceFragmentDoc = gql`
    fragment stopPlace on StopPlace {
  id
  name
  latitude
  longitude
}
    `;
export const QuayFragmentDoc = gql`
    fragment quay on Quay {
  id
  name
  publicCode
  situations {
    ...situation
  }
  stopPlace {
    ...stopPlace
  }
}
    ${SituationFragmentDoc}
${StopPlaceFragmentDoc}`;
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
    ...quay
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
${QuayFragmentDoc}
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
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    serviceJourneyDepartures(variables: ServiceJourneyDeparturesQueryVariables, options?: C): Promise<ServiceJourneyDeparturesQuery> {
      return requester<ServiceJourneyDeparturesQuery, ServiceJourneyDeparturesQueryVariables>(ServiceJourneyDeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;