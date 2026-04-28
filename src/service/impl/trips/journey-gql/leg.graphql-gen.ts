import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LegFragment } from '../../fragments/journey-gql/legs.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LegFragmentDoc } from '../../fragments/journey-gql/legs.graphql-gen';
export type RefreshLegQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type RefreshLegQuery = { leg?: LegFragment };


export const RefreshLegDocument = gql`
    query RefreshLeg($id: ID!) {
  leg(id: $id) {
    ...leg
  }
}
    ${LegFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    RefreshLeg(variables: RefreshLegQueryVariables, options?: C): Promise<RefreshLegQuery> {
      return requester<RefreshLegQuery, RefreshLegQueryVariables>(RefreshLegDocument, variables, options) as Promise<RefreshLegQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;