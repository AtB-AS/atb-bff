import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetStopPlaceParentQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type GetStopPlaceParentQuery = { stopPlace?: { id: string, parent?: { id: string } } };


export const GetStopPlaceParentDocument = gql`
    query getStopPlaceParent($id: String!) {
  stopPlace(id: $id) {
    id
    parent {
      id
    }
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getStopPlaceParent(variables: GetStopPlaceParentQueryVariables, options?: C): Promise<GetStopPlaceParentQuery> {
      return requester<GetStopPlaceParentQuery, GetStopPlaceParentQueryVariables>(GetStopPlaceParentDocument, variables, options) as Promise<GetStopPlaceParentQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;