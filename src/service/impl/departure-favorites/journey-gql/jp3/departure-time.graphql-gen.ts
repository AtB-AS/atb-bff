import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetDepartureRealtimeQueryVariables = Types.Exact<{
  quayIds: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
  startTime: Types.Scalars['DateTime'];
  timeRange: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type GetDepartureRealtimeQuery = { quays: Array<{ id: string, estimatedCalls: Array<{ realtime: boolean, expectedArrivalTime: any, expectedDepartureTime: any, actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, serviceJourney?: { id: string } }> }> };

export type EstimatedCallFragment = { realtime: boolean, expectedArrivalTime: any, expectedDepartureTime: any, actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, serviceJourney?: { id: string } };

export const EstimatedCallFragmentDoc = gql`
    fragment estimatedCall on EstimatedCall {
  realtime
  serviceJourney {
    id
  }
  expectedArrivalTime
  expectedDepartureTime
  actualArrivalTime
  actualDepartureTime
  aimedArrivalTime
  aimedDepartureTime
}
    `;
export const GetDepartureRealtimeDocument = gql`
    query GetDepartureRealtime($quayIds: [String]!, $startTime: DateTime!, $timeRange: Int!, $limit: Int!) {
  quays(ids: $quayIds) {
    id
    estimatedCalls(
      startTime: $startTime
      numberOfDepartures: $limit
      timeRange: $timeRange
      omitNonBoarding: false
      includeCancelledTrips: false
    ) {
      ...estimatedCall
    }
  }
}
    ${EstimatedCallFragmentDoc}`;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    GetDepartureRealtime(variables: GetDepartureRealtimeQueryVariables, options?: C): Promise<GetDepartureRealtimeQuery> {
      return requester<GetDepartureRealtimeQuery, GetDepartureRealtimeQueryVariables>(GetDepartureRealtimeDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;