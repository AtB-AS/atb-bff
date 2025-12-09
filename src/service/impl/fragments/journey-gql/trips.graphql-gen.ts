import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LineFragment } from './lines.graphql-gen';
import { AuthorityFragment } from './authority.graphql-gen';
import { NoticeFragment } from './notices.graphql-gen';
import { SituationFragment } from './situations.graphql-gen';
import { TariffZoneFragment } from './tariff-zones.graphql-gen';
import { BookingArrangementFragment } from './booking-arrangements.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LineFragmentDoc } from './lines.graphql-gen';
import { AuthorityFragmentDoc } from './authority.graphql-gen';
import { NoticeFragmentDoc } from './notices.graphql-gen';
import { SituationFragmentDoc } from './situations.graphql-gen';
import { TariffZoneFragmentDoc } from './tariff-zones.graphql-gen';
import { BookingArrangementFragmentDoc } from './booking-arrangements.graphql-gen';
export type TripFragment = { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<TripPatternFragment> };

export type TripPatternFragment = { expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, serviceDate?: any, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: (
      { name?: string }
      & LineFragment
    ), fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, stopPositionInPattern: number, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<NoticeFragment> }, toEstimatedCall?: { stopPositionInPattern: number, notices: Array<NoticeFragment> }, situations: Array<SituationFragment>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, description?: string, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<SituationFragment>, tariffZones: Array<TariffZoneFragment> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, description?: string, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<SituationFragment>, tariffZones: Array<TariffZoneFragment> } }, serviceJourney?: { id: string, notices: Array<NoticeFragment>, journeyPattern?: { notices: Array<NoticeFragment> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, staySeated?: boolean, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: AuthorityFragment, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, quay: { name: string } }>, bookingArrangements?: BookingArrangementFragment, datedServiceJourney?: { id: string, estimatedCalls: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } }> };

export const TripPatternFragmentDoc = gql`
    fragment tripPattern on TripPattern {
  expectedStartTime
  expectedEndTime
  duration
  walkDistance
  legs {
    mode
    distance
    duration
    aimedStartTime
    aimedEndTime
    expectedEndTime
    expectedStartTime
    realtime
    line {
      ...line
      name
    }
    fromEstimatedCall {
      aimedDepartureTime
      expectedDepartureTime
      destinationDisplay {
        frontText
        via
      }
      quay {
        publicCode
        name
      }
      notices {
        ...notice
      }
      stopPositionInPattern
    }
    toEstimatedCall {
      notices {
        ...notice
      }
      stopPositionInPattern
    }
    situations {
      ...situation
    }
    fromPlace {
      name
      longitude
      latitude
      quay {
        id
        publicCode
        name
        longitude
        latitude
        description
        stopPlace {
          id
          longitude
          latitude
          name
        }
        situations {
          ...situation
        }
        tariffZones {
          ...tariffZone
        }
      }
    }
    toPlace {
      name
      longitude
      latitude
      quay {
        id
        publicCode
        name
        longitude
        latitude
        description
        stopPlace {
          id
          longitude
          latitude
          name
        }
        situations {
          ...situation
        }
        tariffZones {
          ...tariffZone
        }
      }
    }
    serviceDate
    serviceJourney {
      id
      notices {
        ...notice
      }
      journeyPattern {
        notices {
          ...notice
        }
      }
    }
    interchangeTo {
      toServiceJourney {
        id
      }
      guaranteed
      maximumWaitTime
      staySeated
    }
    pointsOnLink {
      points
      length
    }
    intermediateEstimatedCalls {
      quay {
        name
        id
      }
      date
    }
    authority {
      ...authority
    }
    transportSubmode
    serviceJourneyEstimatedCalls {
      actualDepartureTime
      realtime
      aimedDepartureTime
      expectedDepartureTime
      quay {
        name
      }
      predictionInaccurate
    }
    bookingArrangements {
      ...bookingArrangement
    }
    datedServiceJourney {
      id
      estimatedCalls {
        actualDepartureTime
        quay {
          name
        }
        predictionInaccurate
      }
    }
    rentedBike
  }
}
    ${LineFragmentDoc}
${NoticeFragmentDoc}
${SituationFragmentDoc}
${TariffZoneFragmentDoc}
${AuthorityFragmentDoc}
${BookingArrangementFragmentDoc}`;
export const TripFragmentDoc = gql`
    fragment trip on Trip {
  nextPageCursor
  previousPageCursor
  metadata {
    nextDateTime
    prevDateTime
    searchWindowUsed
  }
  tripPatterns {
    ...tripPattern
  }
}
    ${TripPatternFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;