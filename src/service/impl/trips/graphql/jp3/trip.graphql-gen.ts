import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  when?: Types.Maybe<Types.Scalars['DateTime']>;
}>;


export type TripsQuery = { trip?: Types.Maybe<{ metadata?: Types.Maybe<{ nextDateTime?: Types.Maybe<any>, prevDateTime?: Types.Maybe<any>, searchWindowUsed: number }>, tripPatterns: Array<Types.Maybe<{ expectedStartTime?: Types.Maybe<any>, expectedEndTime?: Types.Maybe<any>, duration?: Types.Maybe<any>, walkDistance?: Types.Maybe<number>, legs: Array<Types.Maybe<{ mode?: Types.Maybe<Types.Mode>, distance?: Types.Maybe<number>, duration?: Types.Maybe<any>, aimedStartTime?: Types.Maybe<any>, expectedEndTime?: Types.Maybe<any>, expectedStartTime?: Types.Maybe<any>, realtime?: Types.Maybe<boolean>, line?: Types.Maybe<{ id: string, publicCode?: Types.Maybe<string>, name?: Types.Maybe<string>, transportSubmode?: Types.Maybe<Types.TransportSubmode> }>, fromEstimatedCall?: Types.Maybe<{ aimedDepartureTime?: Types.Maybe<any>, expectedDepartureTime?: Types.Maybe<any>, destinationDisplay?: Types.Maybe<{ frontText?: Types.Maybe<string> }>, quay?: Types.Maybe<{ publicCode?: Types.Maybe<string>, name: string }> }>, situations: Array<Types.Maybe<{ situationNumber?: Types.Maybe<string>, description: Array<{ value?: Types.Maybe<string> }> }>>, fromPlace: { name?: Types.Maybe<string>, quay?: Types.Maybe<{ publicCode?: Types.Maybe<string>, name: string }> }, serviceJourney?: Types.Maybe<{ id: string }> }>> }>> }> };


export const TripsDocument = gql`
    query Trips($from: Location!, $to: Location!, $when: DateTime) {
  trip(from: $from, to: $to, dateTime: $when) {
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
        expectedEndTime
        expectedStartTime
        realtime
        line {
          id
          publicCode
          name
          transportSubmode
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
        }
        situations {
          situationNumber
          description {
            value
          }
        }
        fromPlace {
          quay {
            publicCode
            name
          }
          name
        }
        serviceJourney {
          id
        }
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