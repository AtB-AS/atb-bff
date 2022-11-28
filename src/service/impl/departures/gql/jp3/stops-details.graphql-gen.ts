import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { SituationFragmentDoc } from '../../../fragments/jp3/situations.graphql-gen';
export type StopsDetailsQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
}>;


export type StopsDetailsQuery = { stopPlaces: Array<{ name: string, transportMode?: Array<Types.TransportMode>, description?: string, id: string, latitude?: number, longitude?: number, quays?: Array<{ id: string, description?: string, name: string, publicCode?: string, stopPlace?: { id: string }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }> }> }> };


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
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    stopsDetails(variables: StopsDetailsQueryVariables, options?: C): Promise<StopsDetailsQuery> {
      return requester<StopsDetailsQuery, StopsDetailsQueryVariables>(StopsDetailsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;