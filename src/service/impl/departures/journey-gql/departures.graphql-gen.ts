import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LineFragment } from '../../fragments/journey-gql/lines.graphql-gen';
import { NoticeFragment } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragment } from '../../fragments/journey-gql/situations.graphql-gen';
import { BookingArrangementFragment } from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LineFragmentDoc } from '../../fragments/journey-gql/lines.graphql-gen';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
import { BookingArrangementFragmentDoc } from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
export type DeparturesQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Array<Types.EstimatedCallFilterInput> | Types.EstimatedCallFilterInput>;
  limitPerLine?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type DeparturesQuery = { quays: Array<{ id: string, description?: string, publicCode?: string, name: string, estimatedCalls: Array<{ date: any, expectedDepartureTime: any, aimedDepartureTime: any, actualDepartureTime?: any, realtime: boolean, predictionInaccurate: boolean, cancellation: boolean, stopPositionInPattern: number, quay: { id: string }, destinationDisplay?: { frontText?: string, via?: Array<string> }, serviceJourney: { id: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, line: (
          { description?: string }
          & LineFragment
        ), journeyPattern?: { notices: Array<NoticeFragment> }, notices: Array<NoticeFragment> }, situations: Array<SituationFragment>, notices: Array<NoticeFragment>, bookingArrangements?: BookingArrangementFragment }>, situations: Array<SituationFragment> }> };


export const DeparturesDocument = gql`
    query departures($ids: [String]!, $numberOfDepartures: Int, $startTime: DateTime, $timeRange: Int, $filters: [EstimatedCallFilterInput!], $limitPerLine: Int) {
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
      filters: $filters
      numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
    ) {
      date
      expectedDepartureTime
      aimedDepartureTime
      actualDepartureTime
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
          ...line
          description
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
      stopPositionInPattern
    }
    situations {
      ...situation
    }
  }
}
    ${LineFragmentDoc}
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