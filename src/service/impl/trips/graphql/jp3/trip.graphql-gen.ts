import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
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
}>;


export type TripsQuery = { trip: { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<{ expectedStartTime?: any, expectedEndTime?: any, duration?: any, walkDistance?: number, legs: Array<{ mode?: Types.Mode, distance?: number, duration?: any, aimedStartTime?: any, aimedEndTime?: any, expectedEndTime?: any, expectedStartTime?: any, realtime?: boolean, transportSubmode?: Types.TransportSubmode, line?: { id: string, name?: string, transportSubmode?: Types.TransportSubmode, publicCode?: string }, fromEstimatedCall?: { aimedDepartureTime?: any, expectedDepartureTime?: any, destinationDisplay?: { frontText?: string }, quay?: { publicCode?: string, name: string }, notices: Array<{ text?: string, id: string }> }, situations: Array<{ situationNumber?: string, description: Array<{ value?: string }> }>, fromPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { longitude?: number, latitude?: number, name: string } } }, toPlace: { name?: string, longitude: number, latitude: number, quay?: { id: string, publicCode?: string, name: string, longitude?: number, latitude?: number, stopPlace?: { longitude?: number, latitude?: number, name: string } } }, serviceJourney?: { id: string }, interchangeTo?: { guaranteed?: boolean, ToServiceJourney?: { id: string } }, pointsOnLink?: { points?: string, length?: number }, intermediateEstimatedCalls: Array<{ quay?: { name: string, id: string } }>, authority?: { id: string } }> }> } };


export const TripsDocument = gql`
    query Trips($from: Location!, $to: Location!, $arriveBy: Boolean!, $when: DateTime, $cursor: String, $transferPenalty: Int, $waitReluctance: Float, $walkReluctance: Float, $walkSpeed: Float) {
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
            text
            id
          }
        }
        situations {
          situationNumber
          description {
            value
          }
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
              longitude
              latitude
              name
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
              longitude
              latitude
              name
            }
          }
        }
        serviceJourney {
          id
        }
        interchangeTo {
          ToServiceJourney {
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
        }
        authority {
          id
        }
        transportSubmode
      }
    }
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    Trips(variables: TripsQueryVariables, options?: C): Promise<TripsQuery> {
      return requester<TripsQuery, TripsQueryVariables>(TripsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;