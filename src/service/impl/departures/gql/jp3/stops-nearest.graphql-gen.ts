import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Group_SituationFieldsFragmentDoc } from '../../../departure-favorites/journey-gql/jp3/departure-group.graphql-gen';
export type NearestStopPlacesQueryVariables = Types.Exact<{
  count?: Types.InputMaybe<Types.Scalars['Int']>;
  distance: Types.Scalars['Float'];
  longitude: Types.Scalars['Float'];
  latitude: Types.Scalars['Float'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type NearestStopPlacesQuery = { nearest?: { pageInfo: { endCursor?: string, hasNextPage: boolean }, edges?: Array<{ node?: { distance?: number, place?: { name: string, transportMode?: Array<Types.TransportMode>, description?: string, id: string, quays?: Array<{ id: string, description?: string, name: string, publicCode?: string, stopPlace?: { id: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, validityPeriod?: { startTime?: any, endTime?: any }, infoLinks?: Array<{ uri: string, label?: string }> }> }> } | {} } }> } };


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
                ...group_situationFields
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
    ${Group_SituationFieldsFragmentDoc}`;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    nearestStopPlaces(variables: NearestStopPlacesQueryVariables, options?: C): Promise<NearestStopPlacesQuery> {
      return requester<NearestStopPlacesQuery, NearestStopPlacesQueryVariables>(NearestStopPlacesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;