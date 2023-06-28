import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { JourneyPatternsFragmentDoc } from '../../fragments/journey-gql/journey-pattern.graphql-gen';
export type GetStopPlaceConnectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetStopPlaceConnectionsQuery = { stopPlace?: { quays?: Array<{ journeyPatterns: Array<{ quays: Array<{ id: string, name: string, publicCode?: string, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> }>, line: { authority?: { id: string } } }> }> } };


export const GetStopPlaceConnectionsDocument = gql`
    query getStopPlaceConnections($id: String!) {
  stopPlace(id: $id) {
    quays {
      journeyPatterns {
        ...journeyPatterns
      }
    }
  }
}
    ${JourneyPatternsFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getStopPlaceConnections(variables: GetStopPlaceConnectionsQueryVariables, options?: C): Promise<GetStopPlaceConnectionsQuery> {
      return requester<GetStopPlaceConnectionsQuery, GetStopPlaceConnectionsQueryVariables>(GetStopPlaceConnectionsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;