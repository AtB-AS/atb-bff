import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type StopsDetailsQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
}>;


export type StopsDetailsQuery = { stopPlaces: Array<{ name: string, transportMode?: Array<Types.TransportMode>, description?: string, id: string, latitude?: number, longitude?: number, quays?: Array<{ id: string, description?: string, name: string, publicCode?: string, stopPlace?: { id: string } }> }> };


export const StopsDetailsDocument = gql`
    query stopsDetails($ids: [String]!) {
  stopPlaces(ids: $ids) {
    name
    quays(filterByInUse: true) {
      id
      description
      name
      publicCode
      stopPlace {
        id
      }
    }
    transportMode
    description
    id
    latitude
    longitude
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    stopsDetails(variables: StopsDetailsQueryVariables, options?: C): Promise<StopsDetailsQuery> {
      return requester<StopsDetailsQuery, StopsDetailsQueryVariables>(StopsDetailsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;