import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { SituationFragment } from '../../fragments/journey-gql/situations.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
export type StopsDetailsQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type StopsDetailsQuery = { stopPlaces: Array<{ name: string, transportMode?: Array<Types.TransportMode>, description?: string, id: string, latitude?: number, longitude?: number, quays?: Array<{ id: string, description?: string, name: string, publicCode?: string, stopPlace?: { id: string }, situations: Array<SituationFragment> }> }> };


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
      situations {
        ...situation
      }
    }
    transportMode
    description
    id
    latitude
    longitude
  }
}
    ${SituationFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    stopsDetails(variables: StopsDetailsQueryVariables, options?: C): Promise<StopsDetailsQuery> {
      return requester<StopsDetailsQuery, StopsDetailsQueryVariables>(StopsDetailsDocument, variables, options) as Promise<StopsDetailsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;