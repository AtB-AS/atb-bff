import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../../fragments/jp3/notices.graphql-gen';
import { SituationFragmentDoc } from '../../../fragments/jp3/situations.graphql-gen';
import { TariffZoneFragmentDoc } from '../../../fragments/jp3/tariff-zones.graphql-gen';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean'];
  when?: Types.InputMaybe<Types.Scalars['DateTime']>;
  cursor?: Types.InputMaybe<Types.Scalars['String']>;
  transferPenalty?: Types.InputMaybe<Types.Scalars['Int']>;
  waitReluctance?: Types.InputMaybe<Types.Scalars['Float']>;
  walkReluctance?: Types.InputMaybe<Types.Scalars['Float']>;
  walkSpeed?: Types.InputMaybe<Types.Scalars['Float']>;
  modes?: Types.InputMaybe<Types.Modes>;
}>;


export type TripsQuery = { trip: { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<{ expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<{ mode: Types.Mode, distance: number, duration: any, aimedStartTime: any, aimedEndTime: any, expectedEndTime: any, expectedStartTime: any, realtime: boolean, transportSubmode?: Types.TransportSubmode, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string, notices: Array<{ id: string, text?: string }> }, fromEstimatedCall?: { aimedDepartureTime: any, expectedDepartureTime: any, destinationDisplay?: { frontText?: string }, quay?: { publicCode?: string, name: string }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }>, tariffZones: Array<{ id: string, name?: string }> } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { id: string, longitude?: number, latitude?: number, name: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }>, tariffZones: Array<{ id: string, name?: string }> } }, serviceJourney?: { id: string, notices: Array<{ id: string, text?: string }>, journeyPattern?: { notices: Array<{ id: string, text?: string }> } }, interchangeTo?: { guaranteed?: boolean, toServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ date?: any, quay?: { name: string, id: string } }>, authority?: { id: string } }> }> } };


export const TripsDocument = gql`
    query Trips($from: Location!, $to: Location!, $arriveBy: Boolean!, $when: DateTime, $cursor: String, $transferPenalty: Int, $waitReluctance: Float, $walkReluctance: Float, $walkSpeed: Float, $modes: Modes) {
  trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    pageCursor: $cursor
    transferPenalty: $transferPenalty
    waitReluctance: $waitReluctance
    walkReluctance: $walkReluctance
    walkSpeed: $walkSpeed
    modes: $modes
  ) {
    nextPageCursor
    previousPageCursor
    metadata {
      nextDateTime
      prevDateTime
      searchWindowUsed
    }
    tripPatterns {
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
          notices {
            ...notice
          }
        }
        fromEstimatedCall {
          aimedDepartureTime
          expectedDepartureTime
          destinationDisplay {
            frontText
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
          id
        }
        transportSubmode
      }
    }
  }
}
    ${NoticeFragmentDoc}
${SituationFragmentDoc}
${TariffZoneFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    Trips(variables: TripsQueryVariables, options?: C): Promise<TripsQuery> {
      return requester<TripsQuery, TripsQueryVariables>(TripsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;