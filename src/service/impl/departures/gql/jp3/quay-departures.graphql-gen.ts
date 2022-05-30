import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type QuayDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type QuayDeparturesQuery = { quay?: { id: string, description?: string, publicCode?: string, name: string, estimatedCalls: Array<{ date?: any, expectedDepartureTime: any, aimedDepartureTime: any, realtime: boolean, cancellation: boolean, quay?: { id: string }, destinationDisplay?: { frontText?: string }, serviceJourney?: { id: string, line: { id: string, description?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }> } };


export const QuayDeparturesDocument = gql`
    query quayDepartures($id: String!, $numberOfDepartures: Int, $startTime: DateTime, $timeRange: Int) {
  quay(id: $id) {
    id
    description
    publicCode
    name
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      startTime: $startTime
      timeRange: $timeRange
      includeCancelledTrips: true
    ) {
      date
      expectedDepartureTime
      aimedDepartureTime
      realtime
      quay {
        id
      }
      destinationDisplay {
        frontText
      }
      serviceJourney {
        id
        line {
          id
          description
          publicCode
          transportMode
          transportSubmode
        }
      }
      cancellation
    }
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    quayDepartures(variables: QuayDeparturesQueryVariables, options?: C): Promise<QuayDeparturesQuery> {
      return requester<QuayDeparturesQuery, QuayDeparturesQueryVariables>(QuayDeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;