import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { ServiceJourneyWithEstCallsFragmentDoc } from '../../fragments/journey-gql/service-journey.graphql-gen';
export type ServiceJourneyWithEstimatedCallsQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  date?: Types.InputMaybe<Types.Scalars['Date']['input']>;
}>;


export type ServiceJourneyWithEstimatedCallsQuery = { serviceJourney?: { id: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, line: { publicCode?: string, notices: Array<{ id: string, text?: string }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }>, estimatedCalls?: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, realtime: boolean, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { id: string, name: string, publicCode?: string, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number, transportMode?: Array<Types.TransportMode> }, tariffZones: Array<{ id: string, name?: string }> }, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } } }> } };


export const ServiceJourneyWithEstimatedCallsDocument = gql`
    query serviceJourneyWithEstimatedCalls($id: String!, $date: Date) {
  serviceJourney(id: $id) {
    ...serviceJourneyWithEstCalls
  }
}
    ${ServiceJourneyWithEstCallsFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    serviceJourneyWithEstimatedCalls(variables: ServiceJourneyWithEstimatedCallsQueryVariables, options?: C): Promise<ServiceJourneyWithEstimatedCallsQuery> {
      return requester<ServiceJourneyWithEstimatedCallsQuery, ServiceJourneyWithEstimatedCallsQueryVariables>(ServiceJourneyWithEstimatedCallsDocument, variables, options) as Promise<ServiceJourneyWithEstimatedCallsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;