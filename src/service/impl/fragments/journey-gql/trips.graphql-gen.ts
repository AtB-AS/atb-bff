import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from './notices.graphql-gen';
import { SituationFragmentDoc } from './situations.graphql-gen';
import { TariffZoneFragmentDoc } from './tariff-zones.graphql-gen';
import { AuthorityFragmentDoc } from './authority.graphql-gen';
import { BookingArrangementFragmentDoc } from './booking-arrangements.graphql-gen';
export type TripFragment = { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<{ expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string, flexibleLineType?: string, notices: Array<{ id: string, text?: string }> }, fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, serviceJourney?: { id: string, notices: Array<{ id: string, text?: string }>, journeyPattern?: { notices: Array<{ id: string, text?: string }> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: { id: string, name: string, url?: string }, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, quay: { name: string } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } }, datedServiceJourney?: { estimatedCalls?: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } }> }> };

export type TripPatternFragment = { expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, rentedBike?: boolean, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string, flexibleLineType?: string, notices: Array<{ id: string, text?: string }> }, fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, destinationDisplay?: { frontText?: string, via?: Array<string> }, quay: { publicCode?: string, name: string }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, tariffZones: Array<{ id: string, name?: string }> } }, serviceJourney?: { id: string, notices: Array<{ id: string, text?: string }>, journeyPattern?: { notices: Array<{ id: string, text?: string }> } }, interchangeTo?: { guaranteed?: boolean, maximumWaitTime?: number, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date: any, quay: { name: string, id: string } }>, authority?: { id: string, name: string, url?: string }, serviceJourneyEstimatedCalls: Array<{ actualDepartureTime?: any, realtime: boolean, aimedDepartureTime: any, expectedDepartureTime: any, predictionInaccurate: boolean, quay: { name: string } }>, bookingArrangements?: { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } }, datedServiceJourney?: { estimatedCalls?: Array<{ actualDepartureTime?: any, predictionInaccurate: boolean, quay: { name: string } }> } }> };

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
      id
      name
      transportSubmode
      publicCode
      flexibleLineType
      notices {
        ...notice
      }
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