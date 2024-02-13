import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { QuayFragmentDoc } from './quays.graphql-gen';
import { NoticeFragmentDoc } from './notices.graphql-gen';
import { SituationFragmentDoc } from './situations.graphql-gen';
import { BookingArrangementFragmentDoc } from './booking-arrangements.graphql-gen';
export type EstimatedCallWithQuayFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, realtime: boolean, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { id: string, name: string, publicCode?: string, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> }, notices: Array<{ id: string, text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } } };

export const EstimatedCallWithQuayFragmentDoc = gql`
    fragment estimatedCallWithQuay on EstimatedCall {
  actualArrivalTime
  actualDepartureTime
  aimedArrivalTime
  aimedDepartureTime
  cancellation
  date
  destinationDisplay {
    frontText
    via
  }
  expectedDepartureTime
  expectedArrivalTime
  forAlighting
  forBoarding
  realtime
  quay {
    ...quay
  }
  notices {
    ...notice
  }
  situations {
    ...situation
  }
  bookingArrangements {
    ...bookingArrangement
  }
}
    ${QuayFragmentDoc}
${NoticeFragmentDoc}
${SituationFragmentDoc}
${BookingArrangementFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;