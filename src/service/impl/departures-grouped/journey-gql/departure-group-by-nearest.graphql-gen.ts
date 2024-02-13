import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Group_StopPlaceFieldsFragmentDoc, Group_QuayFieldsFragmentDoc, Group_Times_EstimatedCallFieldsFragmentDoc, Group_EstimatedCallFieldsFragmentDoc } from './departure-group.graphql-gen';
export type GroupsByNearestQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lng: Types.Scalars['Float'];
  distance: Types.Scalars['Float'];
  startTime: Types.Scalars['DateTime'];
  fromCursor?: Types.InputMaybe<Types.Scalars['String']>;
  pageSize?: Types.InputMaybe<Types.Scalars['Int']>;
  timeRange: Types.Scalars['Int'];
  limitPerLine: Types.Scalars['Int'];
  totalLimit: Types.Scalars['Int'];
  filterInput?: Types.InputMaybe<Types.InputPlaceIds>;
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']>> | Types.InputMaybe<Types.Scalars['ID']>>;
}>;


export type GroupsByNearestQuery = { nearest?: { pageInfo: { hasNextPage: boolean, endCursor?: string }, edges?: Array<{ cursor: string, node?: { distance?: number, place?: { id: string, description?: string, name: string, latitude?: number, longitude?: number, quays?: Array<{ id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, times: Array<{ date: any, expectedDepartureTime: any, aimedDepartureTime: any, predictionInaccurate: boolean, realtime: boolean, cancellation: boolean, destinationDisplay?: { frontText?: string, via?: Array<string> }, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, serviceJourney: { id: string, line: { id: string } }, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } } }>, estimatedCalls: Array<{ destinationDisplay?: { frontText?: string, via?: Array<string> }, notices: Array<{ id: string, text?: string }>, serviceJourney: { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: { description?: string, flexibleLineType?: string, id: string, name?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }> } }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }> } | {} } }> } };


export const GroupsByNearestDocument = gql`
    query GroupsByNearest($lat: Float!, $lng: Float!, $distance: Float!, $startTime: DateTime!, $fromCursor: String, $pageSize: Int, $timeRange: Int!, $limitPerLine: Int!, $totalLimit: Int!, $filterInput: InputPlaceIds, $filterByLineIds: [ID]) {
  nearest(
    latitude: $lat
    longitude: $lng
    after: $fromCursor
    first: $pageSize
    maximumDistance: $distance
    filterByPlaceTypes: stopPlace
    filterByInUse: true
    filterByIds: $filterInput
    multiModalMode: child
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        distance
        place {
          ... on StopPlace {
            ...group_stopPlaceFields
            quays {
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
      }
    }
  }
}
    ${Group_StopPlaceFieldsFragmentDoc}
${Group_QuayFieldsFragmentDoc}
${Group_Times_EstimatedCallFieldsFragmentDoc}
${Group_EstimatedCallFieldsFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GroupsByNearest(variables: GroupsByNearestQueryVariables, options?: C): Promise<GroupsByNearestQuery> {
      return requester<GroupsByNearestQuery, GroupsByNearestQueryVariables>(GroupsByNearestDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;