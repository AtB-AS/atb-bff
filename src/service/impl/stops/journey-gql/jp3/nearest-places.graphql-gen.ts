import * as Types from '../../../../../graphql/journey-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type NearestPlacesQueryVariables = Types.Exact<{
  filterByInUse?: Types.Maybe<Types.Scalars['Boolean']>;
  filterByPlaceTypes?: Types.Maybe<Array<Types.Maybe<Types.FilterPlaceType>> | Types.Maybe<Types.FilterPlaceType>>;
  maximumResults?: Types.Maybe<Types.Scalars['Int']>;
  maximumDistance: Types.Scalars['Float'];
  longitude: Types.Scalars['Float'];
  latitude: Types.Scalars['Float'];
}>;


export type NearestPlacesQuery = { nearest?: Types.Maybe<{ pageInfo: { endCursor?: Types.Maybe<string>, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: Types.Maybe<string> }, edges?: Types.Maybe<Array<Types.Maybe<{ cursor: string, node?: Types.Maybe<{ distance?: Types.Maybe<number>, place?: Types.Maybe<{ id: string, name: string, latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number>, publicCode?: Types.Maybe<string>, description?: Types.Maybe<string> } | { id: string, name: string, transportMode?: Types.Maybe<Array<Types.Maybe<Types.TransportMode>>>, description?: Types.Maybe<string>, longitude?: Types.Maybe<number>, latitude?: Types.Maybe<number>, quays?: Types.Maybe<Array<Types.Maybe<{ id: string, description?: Types.Maybe<string>, name: string, publicCode?: Types.Maybe<string> }>>> }> }> }>>> }> };


export const NearestPlacesDocument = gql`
    query nearestPlaces($filterByInUse: Boolean, $filterByPlaceTypes: [FilterPlaceType] = quay, $maximumResults: Int = 10, $maximumDistance: Float!, $longitude: Float!, $latitude: Float!) {
  nearest(
    filterByInUse: $filterByInUse
    latitude: $latitude
    longitude: $longitude
    maximumDistance: $maximumDistance
    filterByPlaceTypes: $filterByPlaceTypes
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
          ... on Quay {
            id
            name
            latitude
            longitude
            publicCode
            description
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
    nearestPlaces(variables: NearestPlacesQueryVariables, options?: C): Promise<NearestPlacesQuery> {
      return requester<NearestPlacesQuery, NearestPlacesQueryVariables>(NearestPlacesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;