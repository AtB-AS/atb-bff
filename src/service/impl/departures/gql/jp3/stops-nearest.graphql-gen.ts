import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { SituationFragmentDoc } from '../../../fragments/jp3/situations.graphql-gen';
export type NearestStopPlacesQueryVariables = Types.Exact<{
  count?: Types.InputMaybe<Types.Scalars['Int']>;
  distance: Types.Scalars['Float'];
  longitude: Types.Scalars['Float'];
  latitude: Types.Scalars['Float'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type NearestStopPlacesQuery = { nearest?: { pageInfo: { endCursor?: string, hasNextPage: boolean }, edges?: Array<{ node?: { distance?: number, place?: { name: string, transportMode?: Array<Types.TransportMode>, description?: string, id: string, quays?: Array<{ id: string, description?: string, name: string, publicCode?: string, stopPlace?: { id: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }> }> } | {} } }> } };


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
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    nearestStopPlaces(variables: NearestStopPlacesQueryVariables, options?: C): Promise<NearestStopPlacesQuery> {
      return requester<NearestStopPlacesQuery, NearestStopPlacesQueryVariables>(NearestStopPlacesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;