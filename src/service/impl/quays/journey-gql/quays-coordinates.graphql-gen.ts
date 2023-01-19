import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetQuaysCoordinatesQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
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
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getQuaysCoordinates(variables: GetQuaysCoordinatesQueryVariables, options?: C): Promise<GetQuaysCoordinatesQuery> {
      return requester<GetQuaysCoordinatesQuery, GetQuaysCoordinatesQueryVariables>(GetQuaysCoordinatesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;