import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetQuaysCoordinatesQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetQuaysCoordinatesQuery = { quays: Array<{ id: string, name: string, longitude?: number, latitude?: number }> };


export const GetQuaysCoordinatesDocument = gql`
    query getQuaysCoordinates($ids: [String]!) {
  quays(ids: $ids) {
    id
    name
    longitude
    latitude
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getQuaysCoordinates(variables: GetQuaysCoordinatesQueryVariables, options?: C): Promise<GetQuaysCoordinatesQuery> {
      return requester<GetQuaysCoordinatesQuery, GetQuaysCoordinatesQueryVariables>(GetQuaysCoordinatesDocument, variables, options) as Promise<GetQuaysCoordinatesQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;