import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type NearestStopPlacesQueryVariables = Types.Exact<{
  count?: Types.Maybe<Types.Scalars['Int']>;
  distance: Types.Scalars['Float'];
  longitude: Types.Scalars['Float'];
  latitude: Types.Scalars['Float'];
  after?: Types.Maybe<Types.Scalars['String']>;
}>;


export type NearestStopPlacesQuery = { nearest?: Types.Maybe<{ pageInfo: { endCursor?: Types.Maybe<string>, hasNextPage: boolean }, edges?: Types.Maybe<Array<Types.Maybe<{ node?: Types.Maybe<{ distance?: Types.Maybe<number>, place?: Types.Maybe<{ name: string, transportMode?: Types.Maybe<Array<Types.Maybe<Types.TransportMode>>>, description?: Types.Maybe<string>, id: string, quays?: Types.Maybe<Array<Types.Maybe<{ id: string, description?: Types.Maybe<string>, name: string, publicCode?: Types.Maybe<string>, stopPlace?: Types.Maybe<{ id: string }> }>>> }> }> }>>> }> };


export const NearestStopPlacesDocument = gql`
    query nearestStopPlaces($count: Int = 10, $distance: Float!, $longitude: Float!, $latitude: Float!, $after: String) {
  nearest(
    latitude: $latitude
    longitude: $longitude
    maximumDistance: $distance
    first: $count
    after: $after
    filterByInUse: true
    filterByPlaceTypes: stopPlace
    multiModalMode: parent
  ) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        distance
        place {
          ... on StopPlace {
            name
            quays(filterByInUse: true) {
              id
              description
              name
              publicCode
              stopPlace {
                id
              }
            }
            transportMode
            description
            id
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