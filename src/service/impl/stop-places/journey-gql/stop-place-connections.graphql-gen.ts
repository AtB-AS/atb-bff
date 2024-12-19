import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { JourneyPatternsFragment } from '../../fragments/journey-gql/journey-pattern.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { JourneyPatternsFragmentDoc } from '../../fragments/journey-gql/journey-pattern.graphql-gen';
export type GetStopPlaceConnectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type GetStopPlaceConnectionsQuery = { stopPlace?: { quays?: Array<{ journeyPatterns: Array<JourneyPatternsFragment> }> } };


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
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getStopPlaceConnections(variables: GetStopPlaceConnectionsQueryVariables, options?: C): Promise<GetStopPlaceConnectionsQuery> {
      return requester<GetStopPlaceConnectionsQuery, GetStopPlaceConnectionsQueryVariables>(GetStopPlaceConnectionsDocument, variables, options) as Promise<GetStopPlaceConnectionsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;