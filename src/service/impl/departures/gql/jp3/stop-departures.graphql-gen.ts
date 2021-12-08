import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type StopPlaceQuayDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  numberOfDepartures?: Types.Maybe<Types.Scalars['Int']>;
  startTime?: Types.Maybe<Types.Scalars['DateTime']>;
}>;


export type StopPlaceQuayDeparturesQuery = { stopPlace?: Types.Maybe<{ id: string, quays?: Types.Maybe<Array<Types.Maybe<{ id: string, estimatedCalls: Array<Types.Maybe<{ expectedDepartureTime?: Types.Maybe<any>, realtime?: Types.Maybe<boolean>, quay?: Types.Maybe<{ id: string, stopPlace?: Types.Maybe<{ id: string }> }>, destinationDisplay?: Types.Maybe<{ frontText?: Types.Maybe<string> }>, serviceJourney?: Types.Maybe<{ id: string, privateCode?: Types.Maybe<string>, line: { name?: Types.Maybe<string>, id: string, description?: Types.Maybe<string>, publicCode?: Types.Maybe<string>, transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode> } }> }>> }>>> }> };


export const StopPlaceQuayDeparturesDocument = gql`
    query stopPlaceQuayDepartures($id: String!, $numberOfDepartures: Int, $startTime: DateTime) {
  stopPlace(id: $id) {
    id
    quays(filterByInUse: true) {
      id
      estimatedCalls(numberOfDepartures: $numberOfDepartures, startTime: $startTime) {
        expectedDepartureTime
        realtime
        quay {
          id
          stopPlace {
            id
          }
        }
        destinationDisplay {
          frontText
        }
        serviceJourney {
          id
          privateCode
          line {
            name
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