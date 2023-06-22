import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetStopPlaceQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetStopPlaceQuery = { stopPlace?: { quays?: Array<{ journeyPatterns: Array<{ quays: Array<{ stopPlace?: { name: string, id: string } }> }> }> } };


export const GetStopPlaceDocument = gql`
    query getStopPlace($id: String!) {
  stopPlace(id: $id) {
    quays {
      journeyPatterns {
        quays {
          stopPlace {
            name
            id
          }
        }
      }
    }
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getStopPlace(variables: GetStopPlaceQueryVariables, options?: C): Promise<GetStopPlaceQuery> {
      return requester<GetStopPlaceQuery, GetStopPlaceQueryVariables>(GetStopPlaceDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;