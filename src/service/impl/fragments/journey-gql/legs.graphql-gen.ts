import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LineFragment } from './lines.graphql-gen';
import { AuthorityFragment } from './authority.graphql-gen';
import { NoticeFragment } from './notices.graphql-gen';
import { SituationFragment } from './situations.graphql-gen';
import { StopPlaceFragment } from './stop-places.graphql-gen';
import { TariffZoneFragment } from './tariff-zones.graphql-gen';
import { InterchangeFragment } from './interchanges.graphql-gen';
import { BookingArrangementFragment } from './booking-arrangements.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LineFragmentDoc } from './lines.graphql-gen';
import { AuthorityFragmentDoc } from './authority.graphql-gen';
import { NoticeFragmentDoc } from './notices.graphql-gen';
import { SituationFragmentDoc } from './situations.graphql-gen';
import { StopPlaceFragmentDoc } from './stop-places.graphql-gen';
import { TariffZoneFragmentDoc } from './tariff-zones.graphql-gen';
import { InterchangeFragmentDoc } from './interchanges.graphql-gen';
import { BookingArrangementFragmentDoc } from './booking-arrangements.graphql-gen';
export type LegFragment = { id?: string, mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: (
    { name?: string }
    & LineFragment
  ), fromEstimatedCall?: { actualDepartureTime?: any, aimedDepartureTime: any, expectedDepartureTime: any, stopPositionInPattern: number, cancellation: boolean, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<NoticeFragment>, situations: Array<SituationFragment> }, toEstimatedCall?: { actualArrivalTime?: any, stopPositionInPattern: number, cancellation: boolean, notices: Array<NoticeFragment>, situations: Array<SituationFragment> }, situations: Array<SituationFragment>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, description?: string, stopPlace?: StopPlaceFragment, situations: Array<SituationFragment>, tariffZones: Array<TariffZoneFragment> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, description?: string, stopPlace?: StopPlaceFragment, situations: Array<SituationFragment>, tariffZones: Array<TariffZoneFragment> } }, serviceJourney?: { id: string, notices: Array<NoticeFragment>, journeyPattern?: { notices: Array<NoticeFragment> } }, interchangeTo?: InterchangeFragment, interchangeFrom?: InterchangeFragment, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, stopPositionInPattern: number, aimedDepartureTime: any, expectedDepartureTime: any, realtime: boolean, forAlighting: boolean, forBoarding: boolean, quay: { name: string, id: string, stopPlace?: StopPlaceFragment }, notices: Array<NoticeFragment> }>, authority?: AuthorityFragment, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, cancellation: boolean, quay: { name: string } }>, bookingArrangements?: BookingArrangementFragment, datedServiceJourney?: { id: string, estimatedCalls: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } };

export const LegFragmentDoc = gql`
    fragment leg on Leg {
  id
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
    actualDepartureTime
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
    situations {
      ...situation
    }
    stopPositionInPattern
    cancellation
  }
  toEstimatedCall {
    actualArrivalTime
    notices {
      ...notice
    }
    situations {
      ...situation
    }
    stopPositionInPattern
    cancellation
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
        ...stopPlace
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
        ...stopPlace
      }
      situations {
        ...situation
      }
      tariffZones {
        ...tariffZone
      }
    }
  }
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
    ...interchange
  }
  interchangeFrom {
    ...interchange
  }
  pointsOnLink {
    points
    length
  }
  intermediateEstimatedCalls {
    quay {
      name
      id
      stopPlace {
        ...stopPlace
      }
    }
    date
    stopPositionInPattern
    aimedDepartureTime
    expectedDepartureTime
    realtime
    forAlighting
    forBoarding
    notices {
      ...notice
    }
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
    cancellation
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
    ${LineFragmentDoc}
${NoticeFragmentDoc}
${SituationFragmentDoc}
${StopPlaceFragmentDoc}
${TariffZoneFragmentDoc}
${InterchangeFragmentDoc}
${AuthorityFragmentDoc}
${BookingArrangementFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;