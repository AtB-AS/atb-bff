import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LineFragment } from '../../fragments/journey-gql/lines.graphql-gen';
import { AuthorityFragment } from '../../fragments/journey-gql/authority.graphql-gen';
import { NoticeFragment } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragment } from '../../fragments/journey-gql/situations.graphql-gen';
import { TariffZoneFragment } from '../../fragments/journey-gql/tariff-zones.graphql-gen';
import { BookingArrangementFragment } from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LineFragmentDoc } from '../../fragments/journey-gql/lines.graphql-gen';
import { AuthorityFragmentDoc } from '../../fragments/journey-gql/authority.graphql-gen';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
import { TariffZoneFragmentDoc } from '../../fragments/journey-gql/tariff-zones.graphql-gen';
import { BookingArrangementFragmentDoc } from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
export type RefreshLegQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type RefreshLegQuery = { leg?: { id?: string, mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: (
      { name?: string }
      & LineFragment
    ), fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, stopPositionInPattern: number, cancellation: boolean, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<NoticeFragment>, situations: Array<SituationFragment> }, toEstimatedCall?: { stopPositionInPattern: number, cancellation: boolean, notices: Array<NoticeFragment>, situations: Array<SituationFragment> }, situations: Array<SituationFragment>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, description?: string, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<SituationFragment>, tariffZones: Array<TariffZoneFragment> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, description?: string, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<SituationFragment>, tariffZones: Array<TariffZoneFragment> } }, serviceJourney?: { id: string, notices: Array<NoticeFragment>, journeyPattern?: { notices: Array<NoticeFragment> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, staySeated?: boolean, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: AuthorityFragment, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, cancellation: boolean, quay: { name: string } }>, bookingArrangements?: BookingArrangementFragment, datedServiceJourney?: { id: string, estimatedCalls: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } } };


export const RefreshLegDocument = gql`
    query RefreshLeg($id: ID!) {
  leg(id: $id) {
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
}
    ${LineFragmentDoc}
${NoticeFragmentDoc}
${SituationFragmentDoc}
${TariffZoneFragmentDoc}
${AuthorityFragmentDoc}
${BookingArrangementFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    RefreshLeg(variables: RefreshLegQueryVariables, options?: C): Promise<RefreshLegQuery> {
      return requester<RefreshLegQuery, RefreshLegQueryVariables>(RefreshLegDocument, variables, options) as Promise<RefreshLegQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;