import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type FavouriteDepartureQueryVariables = Types.Exact<{
  quayIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  lines?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']>> | Types.InputMaybe<Types.Scalars['ID']>>;
}>;


export type FavouriteDepartureQuery = { quays: Array<{ id: string, name: string, publicCode?: string, stopPlace?: { id: string, description?: string, name: string, longitude?: number, latitude?: number }, estimatedCalls: Array<{ date?: any, expectedDepartureTime: any, aimedDepartureTime: any, realtime: boolean, quay?: { id: string }, destinationDisplay?: { frontText?: string }, serviceJourney?: { id: string, line: { id: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, name?: string } } }> }> };


export const FavouriteDepartureDocument = gql`
    query favouriteDeparture($quayIds: [String], $lines: [ID]) {
  quays(ids: $quayIds) {
    id
    name
    publicCode
    stopPlace {
      id
      description
      name
      longitude
      latitude
    }
    estimatedCalls(
      whiteListed: {lines: $lines}
      numberOfDepartures: 30
      numberOfDeparturesPerLineAndDestinationDisplay: 7
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
          publicCode
          transportMode
          transportSubmode
          name
        }
      }
    }
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    favouriteDeparture(variables?: FavouriteDepartureQueryVariables, options?: C): Promise<FavouriteDepartureQuery> {
      return requester<FavouriteDepartureQuery, FavouriteDepartureQueryVariables>(FavouriteDepartureDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;