import * as Types from '../../../../graphql/stops-types';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type QuaysInMultimodalQueryVariables = Types.Exact<{
  stopId: Types.Scalars['String'];
}>;


export type QuaysInMultimodalQuery = { stopPlace?: Types.Maybe<Array<Types.Maybe<{ id?: Types.Maybe<string>, children?: Types.Maybe<Array<Types.Maybe<{ id?: Types.Maybe<string> }>>> }>>> };


export const QuaysInMultimodalDocument = gql`
    query QuaysInMultimodal($stopId: String!) {
  stopPlace(id: $stopId) {
    ... on ParentStopPlace {
      id
      children {
        id
      }
    }
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    QuaysInMultimodal(variables: QuaysInMultimodalQueryVariables, options?: C): Promise<QuaysInMultimodalQuery> {
      return requester<QuaysInMultimodalQuery, QuaysInMultimodalQueryVariables>(QuaysInMultimodalDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;