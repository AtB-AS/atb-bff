import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetHarborsQueryVariables = Types.Exact<{
  authorities?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;


export type GetHarborsQuery = { lines: Array<{ transportSubmode?: Types.TransportSubmode, quays: Array<{ stopPlace?: { name: string, id: string, latitude?: number, longitude?: number } }> }> };


export const GetHarborsDocument = gql`
    query getHarbors($authorities: [String]) {
  lines(authorities: $authorities, transportModes: water) {
    quays {
      stopPlace {
        name
        id
        latitude
        longitude
      }
    }
    transportSubmode
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getHarbors(variables?: GetHarborsQueryVariables, options?: C): Promise<GetHarborsQuery> {
      return requester<GetHarborsQuery, GetHarborsQueryVariables>(GetHarborsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;