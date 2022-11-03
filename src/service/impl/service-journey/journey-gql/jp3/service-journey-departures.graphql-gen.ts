import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type ServiceJourneyDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  date?: Types.InputMaybe<Types.Scalars['Date']>;
}>;


export type ServiceJourneyDeparturesQuery = { serviceJourney?: { estimatedCalls?: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay?: { id: string, name: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } }, serviceJourney?: { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }> }> } };

export type EstimatedCallFieldsFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay?: { id: string, name: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } }, serviceJourney?: { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }> };

export type NoticeFieldsFragment = { text?: string };

export type QuayFieldsFragment = { id: string, name: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } };

export type SituationFieldsFragment = { situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }> };

export type LineFieldsFragment = { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode };

export type StopPlaceFieldsFragment = { id: string, name: string, latitude?: number, longitude?: number };

export type ServiceJourneyFieldsFragment = { id: string, journeyPattern?: { line: { id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } };

export const NoticeFieldsFragmentDoc = gql`
    fragment noticeFields on Notice {
  text
}
    `;
export const SituationFieldsFragmentDoc = gql`
    fragment situationFields on PtSituationElement {
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
export const StopPlaceFieldsFragmentDoc = gql`
    fragment stopPlaceFields on StopPlace {
  id
  name
  latitude
  longitude
}
    `;
export const QuayFieldsFragmentDoc = gql`
    fragment quayFields on Quay {
  id
  name
  publicCode
  situations {
    ...situationFields
  }
  stopPlace {
    ...stopPlaceFields
  }
}
    ${SituationFieldsFragmentDoc}
${StopPlaceFieldsFragmentDoc}`;
export const LineFieldsFragmentDoc = gql`
    fragment lineFields on Line {
  id
  name
  publicCode
  transportMode
  transportSubmode
}
    `;
export const ServiceJourneyFieldsFragmentDoc = gql`
    fragment serviceJourneyFields on ServiceJourney {
  id
  journeyPattern {
    line {
      ...lineFields
    }
  }
}
    ${LineFieldsFragmentDoc}`;
export const EstimatedCallFieldsFragmentDoc = gql`
    fragment estimatedCallFields on EstimatedCall {
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
    ...noticeFields
  }
  quay {
    ...quayFields
  }
  realtime
  serviceJourney {
    ...serviceJourneyFields
  }
  situations {
    ...situationFields
  }
}
    ${NoticeFieldsFragmentDoc}
${QuayFieldsFragmentDoc}
${ServiceJourneyFieldsFragmentDoc}
${SituationFieldsFragmentDoc}`;
export const ServiceJourneyDeparturesDocument = gql`
    query serviceJourneyDepartures($id: String!, $date: Date) {
  serviceJourney(id: $id) {
    estimatedCalls(date: $date) {
      ...estimatedCallFields
    }
  }
}
    ${EstimatedCallFieldsFragmentDoc}`;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    serviceJourneyDepartures(variables: ServiceJourneyDeparturesQueryVariables, options?: C): Promise<ServiceJourneyDeparturesQuery> {
      return requester<ServiceJourneyDeparturesQuery, ServiceJourneyDeparturesQueryVariables>(ServiceJourneyDeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;