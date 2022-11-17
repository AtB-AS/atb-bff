import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GroupsByIdQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  startTime: Types.Scalars['DateTime'];
  timeRange: Types.Scalars['Int'];
  limitPerLine: Types.Scalars['Int'];
  totalLimit: Types.Scalars['Int'];
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']>> | Types.InputMaybe<Types.Scalars['ID']>>;
}>;


export type GroupsByIdQuery = { stopPlaces: Array<{ id: string, description?: string, name: string, latitude?: number, longitude?: number, quays?: Array<{ id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, times: Array<{ date?: any, expectedDepartureTime: any, aimedDepartureTime: any, predictionInaccurate: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, serviceJourney?: { id: string, line: { id: string } } }>, estimatedCalls: Array<{ destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, serviceJourney?: { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ text?: string }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }, journeyPattern?: { notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> } }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }> }> };

export type QuayIdInStopsQueryVariables = Types.Exact<{
  stopIds: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
}>;


export type QuayIdInStopsQuery = { stopPlaces: Array<{ id: string, quays?: Array<{ id: string }> }> };

export type Group_EstimatedCallFieldsFragment = { destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, serviceJourney?: { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ text?: string }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }, journeyPattern?: { notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> } };

export type Group_Times_EstimatedCallFieldsFragment = { date?: any, expectedDepartureTime: any, aimedDepartureTime: any, predictionInaccurate: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, serviceJourney?: { id: string, line: { id: string } } };

export type Group_NoticeFieldsFragment = { text?: string };

export type Group_QuayFieldsFragment = { id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> };

export type Group_SituationFieldsFragment = { situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> };

export type Group_LineFieldsFragment = { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ text?: string }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> };

export type Group_StopPlaceFieldsFragment = { id: string, description?: string, name: string, latitude?: number, longitude?: number };

export type Group_ServiceJourneyFieldsFragment = { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ text?: string }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }, journeyPattern?: { notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> };

export const Group_NoticeFieldsFragmentDoc = gql`
    fragment group_noticeFields on Notice {
  text
}
    `;
export const Group_SituationFieldsFragmentDoc = gql`
    fragment group_situationFields on PtSituationElement {
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
    `;
export const Group_LineFieldsFragmentDoc = gql`
    fragment group_lineFields on Line {
  description
  flexibleLineType
  id
  name
  transportMode
  transportSubmode
  notices {
    ...group_noticeFields
  }
  situations {
    ...group_situationFields
  }
  publicCode
  transportMode
  transportSubmode
}
    ${Group_NoticeFieldsFragmentDoc}
${Group_SituationFieldsFragmentDoc}`;
export const Group_ServiceJourneyFieldsFragmentDoc = gql`
    fragment group_serviceJourneyFields on ServiceJourney {
  id
  directionType
  line {
    ...group_lineFields
  }
  journeyPattern {
    notices {
      ...group_noticeFields
    }
  }
  notices {
    ...group_noticeFields
  }
  privateCode
  transportSubmode
}
    ${Group_LineFieldsFragmentDoc}
${Group_NoticeFieldsFragmentDoc}`;
export const Group_EstimatedCallFieldsFragmentDoc = gql`
    fragment group_estimatedCallFields on EstimatedCall {
  destinationDisplay {
    frontText
  }
  notices {
    ...group_noticeFields
  }
  serviceJourney {
    ...group_serviceJourneyFields
  }
}
    ${Group_NoticeFieldsFragmentDoc}
${Group_ServiceJourneyFieldsFragmentDoc}`;
export const Group_Times_EstimatedCallFieldsFragmentDoc = gql`
    fragment group_times_estimatedCallFields on EstimatedCall {
  destinationDisplay {
    frontText
  }
  date
  expectedDepartureTime
  aimedDepartureTime
  predictionInaccurate
  realtime
  notices {
    ...group_noticeFields
  }
  situations {
    ...group_situationFields
  }
  serviceJourney {
    id
    line {
      id
    }
  }
}
    ${Group_NoticeFieldsFragmentDoc}
${Group_SituationFieldsFragmentDoc}`;
export const Group_QuayFieldsFragmentDoc = gql`
    fragment group_quayFields on Quay {
  id
  name
  description
  publicCode
  latitude
  longitude
  situations {
    ...group_situationFields
  }
}
    ${Group_SituationFieldsFragmentDoc}`;
export const Group_StopPlaceFieldsFragmentDoc = gql`
    fragment group_stopPlaceFields on StopPlace {
  id
  description
  name
  latitude
  longitude
}
    `;
export const GroupsByIdDocument = gql`
    query GroupsById($ids: [String], $startTime: DateTime!, $timeRange: Int!, $limitPerLine: Int!, $totalLimit: Int!, $filterByLineIds: [ID]) {
  stopPlaces(ids: $ids) {
    ...group_stopPlaceFields
    quays(filterByInUse: true) {
      ...group_quayFields
      times: estimatedCalls(
        startTime: $startTime
        timeRange: $timeRange
        numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
        numberOfDepartures: $totalLimit
        arrivalDeparture: both
        includeCancelledTrips: false
        whiteListed: {lines: $filterByLineIds}
      ) {
        ...group_times_estimatedCallFields
      }
      estimatedCalls(
        startTime: $startTime
        timeRange: $timeRange
        numberOfDepartures: $totalLimit
        numberOfDeparturesPerLineAndDestinationDisplay: 1
        arrivalDeparture: both
        includeCancelledTrips: false
        whiteListed: {lines: $filterByLineIds}
      ) {
        ...group_estimatedCallFields
      }
    }
  }
}
    ${Group_StopPlaceFieldsFragmentDoc}
${Group_QuayFieldsFragmentDoc}
${Group_Times_EstimatedCallFieldsFragmentDoc}
${Group_EstimatedCallFieldsFragmentDoc}`;
export const QuayIdInStopsDocument = gql`
    query QuayIdInStops($stopIds: [String]!) {
  stopPlaces(ids: $stopIds) {
    id
    quays(filterByInUse: true) {
      id
    }
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    GroupsById(variables: GroupsByIdQueryVariables, options?: C): Promise<GroupsByIdQuery> {
      return requester<GroupsByIdQuery, GroupsByIdQueryVariables>(GroupsByIdDocument, variables, options);
    },
    QuayIdInStops(variables: QuayIdInStopsQueryVariables, options?: C): Promise<QuayIdInStopsQuery> {
      return requester<QuayIdInStopsQuery, QuayIdInStopsQueryVariables>(QuayIdInStopsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;