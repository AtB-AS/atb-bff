import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { Group_StopPlaceFieldsFragment, Group_QuayFieldsFragment, Group_Times_EstimatedCallFieldsFragment, Group_EstimatedCallFieldsFragment } from './departure-group.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Group_StopPlaceFieldsFragmentDoc, Group_QuayFieldsFragmentDoc, Group_Times_EstimatedCallFieldsFragmentDoc, Group_EstimatedCallFieldsFragmentDoc } from './departure-group.graphql-gen';
export type GroupsByNearestQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float']['input'];
  lng: Types.Scalars['Float']['input'];
  distance: Types.Scalars['Float']['input'];
  startTime: Types.Scalars['DateTime']['input'];
  fromCursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  timeRange: Types.Scalars['Int']['input'];
  limitPerLine: Types.Scalars['Int']['input'];
  totalLimit: Types.Scalars['Int']['input'];
  filterInput?: Types.InputMaybe<Types.InputPlaceIds>;
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>>;
}>;


export type GroupsByNearestQuery = { nearest?: { pageInfo: { hasNextPage: boolean, endCursor?: string }, edges?: Array<{ cursor: string, node?: { distance?: number, place?: (
          { quays?: Array<(
            { times: Array<Group_Times_EstimatedCallFieldsFragment>, estimatedCalls: Array<Group_EstimatedCallFieldsFragment> }
            & Group_QuayFieldsFragment
          )> }
          & Group_StopPlaceFieldsFragment
        ) | {} } }> } };


export const GroupsByNearestDocument = gql`
    query GroupsByNearest($lat: Float!, $lng: Float!, $distance: Float!, $startTime: DateTime!, $fromCursor: String, $pageSize: Int, $timeRange: Int!, $limitPerLine: Int!, $totalLimit: Int!, $filterInput: InputPlaceIds, $filterByLineIds: [ID]) {
  nearest(
    latitude: $lat
    longitude: $lng
    after: $fromCursor
    first: $pageSize
    maximumDistance: $distance
    filterByPlaceTypes: stopPlace
    filterByInUse: true
    filterByIds: $filterInput
    multiModalMode: child
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        distance
        place {
          ... on StopPlace {
            ...group_stopPlaceFields
            quays {
              ...group_quayFields
              times: estimatedCalls(
                startTime: $startTime
                timeRange: $timeRange
                numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
                numberOfDepartures: $totalLimit
                arrivalDeparture: departures
                includeCancelledTrips: false
                whiteListed: {lines: $filterByLineIds}
              ) {
                ...group_times_estimatedCallFields
              }
              estimatedCalls(
                startTime: $startTime
                timeRange: $timeRange
                numberOfDepartures: $totalLimit
                numberOfDeparturesPerLineAndDestinationDisplay: 1
                arrivalDeparture: departures
                includeCancelledTrips: false
                whiteListed: {lines: $filterByLineIds}
              ) {
                ...group_estimatedCallFields
              }
            }
          }
        }
      }
    }
  }
}
    ${Group_StopPlaceFieldsFragmentDoc}
${Group_QuayFieldsFragmentDoc}
${Group_Times_EstimatedCallFieldsFragmentDoc}
${Group_EstimatedCallFieldsFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    GroupsByNearest(variables: GroupsByNearestQueryVariables, options?: C): Promise<GroupsByNearestQuery> {
      return requester<GroupsByNearestQuery, GroupsByNearestQueryVariables>(GroupsByNearestDocument, variables, options) as Promise<GroupsByNearestQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;