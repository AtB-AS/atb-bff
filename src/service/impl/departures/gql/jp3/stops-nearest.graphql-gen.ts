import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type NearestStopPlacesQueryVariables = Types.Exact<{
  filterByInUse?: Types.Maybe<Types.Scalars['Boolean']>;
  maximumResults?: Types.Maybe<Types.Scalars['Int']>;
  maximumDistance: Types.Scalars['Float'];
  longitude: Types.Scalars['Float'];
  latitude: Types.Scalars['Float'];
}>;


export type NearestStopPlacesQuery = { nearest?: Types.Maybe<{ pageInfo: { endCursor?: Types.Maybe<string>, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: Types.Maybe<string> }, edges?: Types.Maybe<Array<Types.Maybe<{ cursor: string, node?: Types.Maybe<{ distance?: Types.Maybe<number>, place?: Types.Maybe<{ id: string, name: string, transportMode?: Types.Maybe<Array<Types.Maybe<Types.TransportMode>>>, description?: Types.Maybe<string>, longitude?: Types.Maybe<number>, latitude?: Types.Maybe<number>, quays?: Types.Maybe<Array<Types.Maybe<{ id: string, description?: Types.Maybe<string>, name: string, publicCode?: Types.Maybe<string> }>>> }> }> }>>> }> };


export const NearestStopPlacesDocument = gql`
    query nearestStopPlaces($filterByInUse: Boolean, $maximumResults: Int = 10, $maximumDistance: Float!, $longitude: Float!, $latitude: Float!) {
  nearest(
    filterByInUse: $filterByInUse
    latitude: $latitude
    longitude: $longitude
    maximumDistance: $maximumDistance
    filterByPlaceTypes: stopPlace
    maximumResults: $maximumResults
  ) {
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      cursor
      node {
        distance
        place {
          ... on StopPlace {
            id
            name
            quays(filterByInUse: $filterByInUse) {
              id
              description
              name
              publicCode
            }
            transportMode
            description
            longitude
            latitude
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
    nearestStopPlaces(variables: NearestStopPlacesQueryVariables, options?: C): Promise<NearestStopPlacesQuery> {
      return requester<NearestStopPlacesQuery, NearestStopPlacesQueryVariables>(NearestStopPlacesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;