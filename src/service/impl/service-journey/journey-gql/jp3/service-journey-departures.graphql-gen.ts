import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type ServiceJourneyDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  date?: Types.InputMaybe<Types.Scalars['Date']>;
}>;


export type ServiceJourneyDeparturesQuery = { serviceJourney?: { estimatedCalls?: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, predictionInaccurate: boolean, realtime: boolean, requestStop: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay?: { id: string, name: string, description?: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, tariffZones: Array<{ id: string }> } }, serviceJourney?: { id: string, publicCode?: string, privateCode?: string, transportSubmode?: Types.TransportSubmode, journeyPattern?: { line: { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }> } };

export type EstimatedCallFieldsFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, predictionInaccurate: boolean, realtime: boolean, requestStop: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay?: { id: string, name: string, description?: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, tariffZones: Array<{ id: string }> } }, serviceJourney?: { id: string, publicCode?: string, privateCode?: string, transportSubmode?: Types.TransportSubmode, journeyPattern?: { line: { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> };

export type NoticeFieldsFragment = { text?: string };

export type QuayFieldsFragment = { id: string, name: string, description?: string, publicCode?: string, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, tariffZones: Array<{ id: string }> } };

export type SituationFieldsFragment = { situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> };

export type LineFieldsFragment = { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> };

export type StopPlaceFieldsFragment = { id: string, description?: string, name: string, latitude?: number, longitude?: number, tariffZones: Array<{ id: string }> };

export type ServiceJourneyFieldsFragment = { id: string, publicCode?: string, privateCode?: string, transportSubmode?: Types.TransportSubmode, journeyPattern?: { line: { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> };

export const NoticeFieldsFragmentDoc = gql`
    fragment noticeFields on Notice {
  text
}
    `;
export const LineFieldsFragmentDoc = gql`
    fragment lineFields on Line {
  description
  flexibleLineType
  id
  name
  notices {
    ...noticeFields
  }
  publicCode
  transportMode
  transportSubmode
}
    ${NoticeFieldsFragmentDoc}`;
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
  lines {
    ...lineFields
  }
  validityPeriod {
    startTime
    endTime
  }
  reportType
  infoLinks {
    uri
    label
  }
}
    ${LineFieldsFragmentDoc}`;
export const StopPlaceFieldsFragmentDoc = gql`
    fragment stopPlaceFields on StopPlace {
  id
  description
  name
  latitude
  longitude
  tariffZones {
    id
  }
}
    `;
export const QuayFieldsFragmentDoc = gql`
    fragment quayFields on Quay {
  id
  name
  description
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
export const ServiceJourneyFieldsFragmentDoc = gql`
    fragment serviceJourneyFields on ServiceJourney {
  id
  journeyPattern {
    line {
      ...lineFields
    }
    notices {
      ...noticeFields
    }
  }
  notices {
    ...noticeFields
  }
  publicCode
  privateCode
  transportSubmode
}
    ${LineFieldsFragmentDoc}
${NoticeFieldsFragmentDoc}`;
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
  forBoarding
  notices {
    ...noticeFields
  }
  predictionInaccurate
  quay {
    ...quayFields
  }
  realtime
  requestStop
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