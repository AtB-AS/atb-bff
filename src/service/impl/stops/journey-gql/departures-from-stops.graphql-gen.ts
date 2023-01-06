import * as Types from '../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type ByIdQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
  startTime: Types.Scalars['DateTime'];
  timeRange: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type ByIdQuery = { stopPlaces: Array<{ id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, quays?: Array<{ id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, estimatedCalls: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, predictionInaccurate: boolean, realtime: boolean, requestStop: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay: { id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, tariffZones: Array<{ id: string }> } }, serviceJourney: { id: string, directionType?: Types.DirectionType, publicCode?: string, privateCode?: string, transportSubmode?: Types.TransportSubmode, journeyPattern?: { line: { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, tariffZones: Array<{ id: string }> } }>, tariffZones: Array<{ id: string }> }> };

export type ByBBoxQueryVariables = Types.Exact<{
  minLat: Types.Scalars['Float'];
  minLng: Types.Scalars['Float'];
  maxLng: Types.Scalars['Float'];
  maxLat: Types.Scalars['Float'];
  timeRange: Types.Scalars['Int'];
  startTime: Types.Scalars['DateTime'];
  limit: Types.Scalars['Int'];
}>;


export type ByBBoxQuery = { stopPlacesByBbox: Array<{ id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, quays?: Array<{ id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, estimatedCalls: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, predictionInaccurate: boolean, realtime: boolean, requestStop: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay: { id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, tariffZones: Array<{ id: string }> } }, serviceJourney: { id: string, directionType?: Types.DirectionType, publicCode?: string, privateCode?: string, transportSubmode?: Types.TransportSubmode, journeyPattern?: { line: { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }>, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, tariffZones: Array<{ id: string }> } }>, tariffZones: Array<{ id: string }> }> };

export type EstimatedCallFieldsFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, predictionInaccurate: boolean, realtime: boolean, requestStop: boolean, destinationDisplay?: { frontText?: string }, notices: Array<{ text?: string }>, quay: { id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, tariffZones: Array<{ id: string }> } }, serviceJourney: { id: string, directionType?: Types.DirectionType, publicCode?: string, privateCode?: string, transportSubmode?: Types.TransportSubmode, journeyPattern?: { line: { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> };

export type NoticeFieldsFragment = { text?: string };

export type QuayFieldsFragment = { id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, situations: Array<{ situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }>, stopPlace?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, tariffZones: Array<{ id: string }> } };

export type SituationFieldsFragment = { situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, lines: Array<{ description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> };

export type LineFieldsFragment = { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> };

export type StopPlaceFieldsFragment = { id: string, description?: string, name: string, latitude?: number, longitude?: number, weighting?: Types.InterchangeWeighting, transportMode?: Array<Types.TransportMode>, transportSubmode?: Array<Types.TransportSubmode>, tariffZones: Array<{ id: string }> };

export type ServiceJourneyFieldsFragment = { id: string, directionType?: Types.DirectionType, publicCode?: string, privateCode?: string, transportSubmode?: Types.TransportSubmode, journeyPattern?: { line: { description?: string, flexibleLineType?: string, id: string, name?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> }, notices: Array<{ text?: string }> };

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
  weighting
  transportMode
  transportSubmode
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
  latitude
  longitude
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
  directionType
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
export const ByIdDocument = gql`
    query ById($ids: [String]!, $startTime: DateTime!, $timeRange: Int!, $limit: Int!) {
  stopPlaces(ids: $ids) {
    ...stopPlaceFields
    quays(filterByInUse: true) {
      ...quayFields
      estimatedCalls(
        startTime: $startTime
        timeRange: $timeRange
        numberOfDepartures: $limit
        arrivalDeparture: departures
        includeCancelledTrips: false
      ) {
        ...estimatedCallFields
      }
    }
  }
}
    ${StopPlaceFieldsFragmentDoc}
${QuayFieldsFragmentDoc}
${EstimatedCallFieldsFragmentDoc}`;
export const ByBBoxDocument = gql`
    query ByBBox($minLat: Float!, $minLng: Float!, $maxLng: Float!, $maxLat: Float!, $timeRange: Int!, $startTime: DateTime!, $limit: Int!) {
  stopPlacesByBbox(
    minimumLatitude: $minLat
    minimumLongitude: $minLng
    maximumLatitude: $maxLat
    maximumLongitude: $maxLng
    multiModalMode: child
  ) {
    ...stopPlaceFields
    quays(filterByInUse: true) {
      ...quayFields
      estimatedCalls(
        startTime: $startTime
        timeRange: $timeRange
        numberOfDepartures: $limit
        arrivalDeparture: departures
        includeCancelledTrips: false
      ) {
        ...estimatedCallFields
      }
    }
  }
}
    ${StopPlaceFieldsFragmentDoc}
${QuayFieldsFragmentDoc}
${EstimatedCallFieldsFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    ById(variables: ByIdQueryVariables, options?: C): Promise<ByIdQuery> {
      return requester<ByIdQuery, ByIdQueryVariables>(ByIdDocument, variables, options);
    },
    ByBBox(variables: ByBBoxQueryVariables, options?: C): Promise<ByBBoxQuery> {
      return requester<ByBBoxQuery, ByBBoxQueryVariables>(ByBBoxDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;