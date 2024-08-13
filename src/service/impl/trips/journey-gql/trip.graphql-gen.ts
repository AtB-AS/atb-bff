import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TripFragmentDoc } from '../../fragments/journey-gql/trips.graphql-gen';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean']['input'];
  when?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  cursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  transferSlack?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  transferPenalty?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  waitReluctance?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  walkReluctance?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  walkSpeed?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  modes?: Types.InputMaybe<Types.Modes>;
  numTripPatterns?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type TripsQuery = { trip: { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<{ expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string, flexibleLineType?: string, notices: Array<{ id: string, text?: string }> }, fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, serviceJourney?: { id: string, notices: Array<{ id: string, text?: string }>, journeyPattern?: { notices: Array<{ id: string, text?: string }> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, staySeated?: boolean, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: { id: string, name: string, url?: string }, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, quay: { name: string } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } }, datedServiceJourney?: { id: string, estimatedCalls?: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } }> }> } };

export type TripsNonTransitQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean']['input'];
  when?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  walkSpeed?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  includeFoot: Types.Scalars['Boolean']['input'];
  includeBicycle: Types.Scalars['Boolean']['input'];
  includeBikeRental: Types.Scalars['Boolean']['input'];
}>;


export type TripsNonTransitQuery = { footTrip: { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<{ expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string, flexibleLineType?: string, notices: Array<{ id: string, text?: string }> }, fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, serviceJourney?: { id: string, notices: Array<{ id: string, text?: string }>, journeyPattern?: { notices: Array<{ id: string, text?: string }> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, staySeated?: boolean, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: { id: string, name: string, url?: string }, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, quay: { name: string } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } }, datedServiceJourney?: { id: string, estimatedCalls?: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } }> }> }, bikeRentalTrip: { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<{ expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string, flexibleLineType?: string, notices: Array<{ id: string, text?: string }> }, fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, serviceJourney?: { id: string, notices: Array<{ id: string, text?: string }>, journeyPattern?: { notices: Array<{ id: string, text?: string }> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, staySeated?: boolean, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: { id: string, name: string, url?: string }, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, quay: { name: string } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } }, datedServiceJourney?: { id: string, estimatedCalls?: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } }> }> }, bicycleTrip: { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<{ expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string, flexibleLineType?: string, notices: Array<{ id: string, text?: string }> }, fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, serviceJourney?: { id: string, notices: Array<{ id: string, text?: string }>, journeyPattern?: { notices: Array<{ id: string, text?: string }> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, staySeated?: boolean, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: { id: string, name: string, url?: string }, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, quay: { name: string } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } }, datedServiceJourney?: { id: string, estimatedCalls?: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } }> }> } };


export const TripsDocument = gql`
    query Trips($from: Location!, $to: Location!, $arriveBy: Boolean!, $when: DateTime, $cursor: String, $transferSlack: Int, $transferPenalty: Int, $waitReluctance: Float, $walkReluctance: Float, $walkSpeed: Float, $modes: Modes, $numTripPatterns: Int) {
  trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    pageCursor: $cursor
    transferSlack: $transferSlack
    transferPenalty: $transferPenalty
    waitReluctance: $waitReluctance
    walkReluctance: $walkReluctance
    walkSpeed: $walkSpeed
    modes: $modes
    numTripPatterns: $numTripPatterns
  ) {
    ...trip
  }
}
    ${TripFragmentDoc}`;
export const TripsNonTransitDocument = gql`
    query TripsNonTransit($from: Location!, $to: Location!, $arriveBy: Boolean!, $when: DateTime, $walkSpeed: Float, $includeFoot: Boolean!, $includeBicycle: Boolean!, $includeBikeRental: Boolean!) {
  footTrip: trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    walkSpeed: $walkSpeed
    modes: {directMode: foot, transportModes: []}
  ) @include(if: $includeFoot) {
    ...trip
  }
  bikeRentalTrip: trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    walkSpeed: $walkSpeed
    modes: {directMode: bike_rental, transportModes: []}
  ) @include(if: $includeBikeRental) {
    ...trip
  }
  bicycleTrip: trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    walkSpeed: $walkSpeed
    modes: {directMode: bicycle, transportModes: []}
  ) @include(if: $includeBicycle) {
    ...trip
  }
}
    ${TripFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    Trips(variables: TripsQueryVariables, options?: C): Promise<TripsQuery> {
      return requester<TripsQuery, TripsQueryVariables>(TripsDocument, variables, options) as Promise<TripsQuery>;
    },
    TripsNonTransit(variables: TripsNonTransitQueryVariables, options?: C): Promise<TripsNonTransitQuery> {
      return requester<TripsNonTransitQuery, TripsNonTransitQueryVariables>(TripsNonTransitDocument, variables, options) as Promise<TripsNonTransitQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;