import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { QuayFragment } from './quays.graphql-gen';
import { NoticeFragment } from './notices.graphql-gen';
import { SituationFragment } from './situations.graphql-gen';
import { BookingArrangementFragment } from './booking-arrangements.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { QuayFragmentDoc } from './quays.graphql-gen';
import { NoticeFragmentDoc } from './notices.graphql-gen';
import { SituationFragmentDoc } from './situations.graphql-gen';
import { BookingArrangementFragmentDoc } from './booking-arrangements.graphql-gen';
export type EstimatedCallWithQuayFragment = { actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, realtime: boolean, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: QuayFragment, notices: Array<NoticeFragment>, situations: Array<SituationFragment>, bookingArrangements?: BookingArrangementFragment };

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