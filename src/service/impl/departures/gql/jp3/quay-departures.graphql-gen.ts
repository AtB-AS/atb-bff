import * as Types from '../../../../../graphql/journey-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type StopPlaceQuayDeparturesQueryVariables = Types.Exact<{
  filterByInUse?: Types.Maybe<Types.Scalars['Boolean']>;
  id: Types.Scalars['String'];
  numberOfDepartures?: Types.Maybe<Types.Scalars['Int']>;
  startTime?: Types.Maybe<Types.Scalars['DateTime']>;
}>;


export type StopPlaceQuayDeparturesQuery = { stopPlace?: Types.Maybe<{ description?: Types.Maybe<string>, id: string, name: string, quays?: Types.Maybe<Array<Types.Maybe<{ description?: Types.Maybe<string>, id: string, name: string, estimatedCalls: Array<Types.Maybe<{ aimedDepartureTime?: Types.Maybe<any>, expectedDepartureTime?: Types.Maybe<any>, realtime?: Types.Maybe<boolean>, realtimeState?: Types.Maybe<Types.RealtimeState>, destinationDisplay?: Types.Maybe<{ frontText?: Types.Maybe<string> }>, serviceJourney?: Types.Maybe<{ id: string, privateCode?: Types.Maybe<string>, transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode>, line: { name?: Types.Maybe<string>, id: string, description?: Types.Maybe<string>, publicCode?: Types.Maybe<string>, transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode> } }> }>> }>>> }> };


export const StopPlaceQuayDeparturesDocument = gql`
    query stopPlaceQuayDepartures($filterByInUse: Boolean = true, $id: String!, $numberOfDepartures: Int, $startTime: DateTime) {
  stopPlace(id: $id) {
    description
    id
    name
    quays(filterByInUse: $filterByInUse) {
      description
      id
      name
      estimatedCalls(numberOfDepartures: $numberOfDepartures, startTime: $startTime) {
        aimedDepartureTime
        expectedDepartureTime
        realtime
        realtimeState
        destinationDisplay {
          frontText
        }
        serviceJourney {
          id
          privateCode
          transportMode
          transportSubmode
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