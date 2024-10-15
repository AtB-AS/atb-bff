import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
import { BookingArrangementFragmentDoc } from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
export type DeparturesQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>>;
  limitPerLine?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type DeparturesQuery = { quays: Array<{ id: string, description?: string, publicCode?: string, name: string, estimatedCalls: Array<{ date: any, expectedDepartureTime: any, aimedDepartureTime: any, realtime: boolean, predictionInaccurate: boolean, cancellation: boolean, quay: { id: string }, destinationDisplay?: { frontText?: string, via?: Array<string> }, serviceJourney: { id: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, line: { id: string, description?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ id: string, text?: string }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, notices: Array<{ id: string, text?: string }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } } }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }> };


export const DeparturesDocument = gql`
    query departures($ids: [String]!, $numberOfDepartures: Int, $startTime: DateTime, $timeRange: Int, $filterByLineIds: [ID], $limitPerLine: Int) {
  quays(ids: $ids) {
    id
    description
    publicCode
    name
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      startTime: $startTime
      timeRange: $timeRange
      includeCancelledTrips: true
      whiteListed: {lines: $filterByLineIds}
      numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
    ) {
      date
      expectedDepartureTime
      aimedDepartureTime
      realtime
      predictionInaccurate
      cancellation
      quay {
        id
      }
      destinationDisplay {
        frontText
        via
      }
      serviceJourney {
        id
        transportMode
        transportSubmode
        line {
          id
          description
          publicCode
          transportMode
          transportSubmode
          notices {
            ...notice
          }
        }
        journeyPattern {
          notices {
            ...notice
          }
        }
        notices {
          ...notice
        }
      }
      situations {
        ...situation
      }
      notices {
        ...notice
      }
      bookingArrangements {
        ...bookingArrangement
      }
    }
    situations {
      ...situation
    }
  }
}
    ${NoticeFragmentDoc}
${SituationFragmentDoc}
${BookingArrangementFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    departures(variables: DeparturesQueryVariables, options?: C): Promise<DeparturesQuery> {
      return requester<DeparturesQuery, DeparturesQueryVariables>(DeparturesDocument, variables, options) as Promise<DeparturesQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;