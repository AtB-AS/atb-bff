import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetDepartureRealtimeQueryVariables = Types.Exact<{
  quayIds: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
  startTime: Types.Scalars['DateTime']['input'];
  timeRange: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  limitPerLine?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  lineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>>;
}>;


export type GetDepartureRealtimeQuery = { quays: Array<{ id: string, estimatedCalls: Array<{ realtime: boolean, expectedArrivalTime: any, expectedDepartureTime: any, actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, serviceJourney: { id: string } }> }> };

export type EstimatedCallFragment = { realtime: boolean, expectedArrivalTime: any, expectedDepartureTime: any, actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, serviceJourney: { id: string } };

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
    query GetDepartureRealtime($quayIds: [String]!, $startTime: DateTime!, $timeRange: Int!, $limit: Int!, $limitPerLine: Int, $lineIds: [ID]) {
  quays(ids: $quayIds) {
    id
    estimatedCalls(
      startTime: $startTime
      numberOfDepartures: $limit
      numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
      timeRange: $timeRange
      arrivalDeparture: departures
      includeCancelledTrips: false
      whiteListed: {lines: $lineIds}
    ) {
      ...estimatedCall
    }
  }
}
    ${EstimatedCallFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    GetDepartureRealtime(variables: GetDepartureRealtimeQueryVariables, options?: C): Promise<GetDepartureRealtimeQuery> {
      return requester<GetDepartureRealtimeQuery, GetDepartureRealtimeQueryVariables>(GetDepartureRealtimeDocument, variables, options) as Promise<GetDepartureRealtimeQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;