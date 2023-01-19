import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
export type GroupsByIdQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  startTime: Types.Scalars['DateTime'];
  timeRange: Types.Scalars['Int'];
  limitPerLine: Types.Scalars['Int'];
  totalLimit: Types.Scalars['Int'];
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']>> | Types.InputMaybe<Types.Scalars['ID']>>;
}>;


export type GroupsByIdQuery = { stopPlaces: Array<{ id: string, description?: string, name: string, latitude?: number, longitude?: number, quays?: Array<{ id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, times: Array<{ date: any, expectedDepartureTime: any, aimedDepartureTime: any, predictionInaccurate: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, serviceJourney: { id: string, line: { id: string } } }>, estimatedCalls: Array<{ destinationDisplay?: { frontText?: string }, notices: Array<{ id: string, text?: string }>, serviceJourney: { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }> } }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }> }> };

export type QuayIdInStopsQueryVariables = Types.Exact<{
  stopIds: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
}>;


export type QuayIdInStopsQuery = { stopPlaces: Array<{ id: string, quays?: Array<{ id: string }> }> };

export type Group_EstimatedCallFieldsFragment = { destinationDisplay?: { frontText?: string }, notices: Array<{ id: string, text?: string }>, serviceJourney: { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }> } };

export type Group_Times_EstimatedCallFieldsFragment = { date: any, expectedDepartureTime: any, aimedDepartureTime: any, predictionInaccurate: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, serviceJourney: { id: string, line: { id: string } } };

export type Group_NoticeFieldsFragment = { text?: string };

export type Group_QuayFieldsFragment = { id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> };

export type Group_LineFieldsFragment = { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> };

export type Group_StopPlaceFieldsFragment = { id: string, description?: string, name: string, latitude?: number, longitude?: number };

export type Group_ServiceJourneyFieldsFragment = { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }> };

export const Group_LineFieldsFragmentDoc = gql`
    fragment group_lineFields on Line {
  description
  flexibleLineType
  id
  name
  transportMode
  transportSubmode
  notices {
    ...notice
  }
  situations {
    ...situation
  }
  publicCode
  transportMode
  transportSubmode
}
    ${NoticeFragmentDoc}
${SituationFragmentDoc}`;
export const Group_ServiceJourneyFieldsFragmentDoc = gql`
    fragment group_serviceJourneyFields on ServiceJourney {
  id
  directionType
  line {
    ...group_lineFields
  }
  journeyPattern {
    notices {
      ...notice
    }
  }
  notices {
    ...notice
  }
  privateCode
  transportSubmode
}
    ${Group_LineFieldsFragmentDoc}
${NoticeFragmentDoc}`;
export const Group_EstimatedCallFieldsFragmentDoc = gql`
    fragment group_estimatedCallFields on EstimatedCall {
  destinationDisplay {
    frontText
  }
  notices {
    ...notice
  }
  serviceJourney {
    ...group_serviceJourneyFields
  }
}
    ${NoticeFragmentDoc}
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
    ...notice
  }
  situations {
    ...situation
  }
  serviceJourney {
    id
    line {
      id
    }
  }
}
    ${NoticeFragmentDoc}
${SituationFragmentDoc}`;
export const Group_NoticeFieldsFragmentDoc = gql`
    fragment group_noticeFields on Notice {
  text
}
    `;
export const Group_QuayFieldsFragmentDoc = gql`
    fragment group_quayFields on Quay {
  id
  name
  description
  publicCode
  latitude
  longitude
  situations {
    ...situation
  }
}
    ${SituationFragmentDoc}`;
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
        arrivalDeparture: departures
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
        arrivalDeparture: departures
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
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
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