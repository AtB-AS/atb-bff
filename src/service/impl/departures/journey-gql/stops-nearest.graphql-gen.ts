import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { SituationFragment } from '../../fragments/journey-gql/situations.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
export type NearestStopPlacesQueryVariables = Types.Exact<{
  count?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  distance: Types.Scalars['Float']['input'];
  longitude: Types.Scalars['Float']['input'];
  latitude: Types.Scalars['Float']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type NearestStopPlacesQuery = { nearest?: { pageInfo: { endCursor?: string, hasNextPage: boolean }, edges?: Array<{ node?: { distance?: number, place?: { name: string, transportMode?: Array<Types.TransportMode>, description?: string, id: string, quays?: Array<{ id: string, description?: string, name: string, publicCode?: string, stopPlace?: { id: string }, situations: Array<SituationFragment> }> } | {} } }> } };


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
              situations {
                ...situation
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
    ${SituationFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    nearestStopPlaces(variables: NearestStopPlacesQueryVariables, options?: C): Promise<NearestStopPlacesQuery> {
      return requester<NearestStopPlacesQuery, NearestStopPlacesQueryVariables>(NearestStopPlacesDocument, variables, options) as Promise<NearestStopPlacesQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;