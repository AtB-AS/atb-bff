import * as Types from '../../../../../graphql/journey-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
}>;


export type TripsQuery = { trip?: Types.Maybe<{ metadata?: Types.Maybe<{ nextDateTime?: Types.Maybe<any>, prevDateTime?: Types.Maybe<any>, searchWindowUsed: number }>, tripPatterns: Array<Types.Maybe<{ expectedStartTime?: Types.Maybe<any>, expectedEndTime?: Types.Maybe<any>, duration?: Types.Maybe<any>, walkDistance?: Types.Maybe<number>, legs: Array<Types.Maybe<{ mode?: Types.Maybe<Types.Mode>, distance?: Types.Maybe<number>, line?: Types.Maybe<{ id: string, publicCode?: Types.Maybe<string>, name?: Types.Maybe<string> }>, fromEstimatedCall?: Types.Maybe<{ aimedDepartureTime?: Types.Maybe<any>, expectedDepartureTime?: Types.Maybe<any> }> }>> }>> }> };


export const TripsDocument = gql`
    query Trips($from: Location!, $to: Location!) {
  trip(from: $from, to: $to) {
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
        line {
          id
          publicCode
          name
        }
        fromEstimatedCall {
          aimedDepartureTime
          expectedDepartureTime
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