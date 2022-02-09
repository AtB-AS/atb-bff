import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type StopPlaceQuayDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type StopPlaceQuayDeparturesQuery = { stopPlace?: { id: string, quays?: Array<{ id: string, estimatedCalls: Array<{ date?: any, expectedDepartureTime?: any, realtime?: boolean, quay?: { id: string }, destinationDisplay?: { frontText?: string }, serviceJourney?: { id: string, line: { id: string, description?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } } }> }> } };


export const StopPlaceQuayDeparturesDocument = gql`
    query stopPlaceQuayDepartures($id: String!, $numberOfDepartures: Int, $startTime: DateTime, $timeRange: Int) {
  stopPlace(id: $id) {
    id
    quays(filterByInUse: true) {
      id
      estimatedCalls(
        numberOfDepartures: $numberOfDepartures
        startTime: $startTime
        timeRange: $timeRange
      ) {
        date
        expectedDepartureTime
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
      }
    }
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    stopPlaceQuayDepartures(variables: StopPlaceQuayDeparturesQueryVariables, options?: C): Promise<StopPlaceQuayDeparturesQuery> {
      return requester<StopPlaceQuayDeparturesQuery, StopPlaceQuayDeparturesQueryVariables>(StopPlaceQuayDeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;