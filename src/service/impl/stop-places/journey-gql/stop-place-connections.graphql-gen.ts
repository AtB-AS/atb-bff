import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { StopPlaceFragmentDoc } from '../../fragments/journey-gql/stop-places.graphql-gen';
export type GetStopPlaceConnectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetStopPlaceConnectionsQuery = { stopPlace?: { quays?: Array<{ journeyPatterns: Array<{ quays: Array<{ stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } }> }> }> } };


export const GetStopPlaceConnectionsDocument = gql`
    query getStopPlaceConnections($id: String!) {
  stopPlace(id: $id) {
    quays {
      journeyPatterns {
        quays {
          stopPlace {
            ...stopPlace
          }
        }
      }
    }
  }
}
    ${StopPlaceFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getStopPlaceConnections(variables: GetStopPlaceConnectionsQueryVariables, options?: C): Promise<GetStopPlaceConnectionsQuery> {
      return requester<GetStopPlaceConnectionsQuery, GetStopPlaceConnectionsQueryVariables>(GetStopPlaceConnectionsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;