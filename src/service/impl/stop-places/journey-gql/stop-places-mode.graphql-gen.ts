import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { StopPlaceFragmentDoc } from '../../fragments/journey-gql/stop-places.graphql-gen';
export type GetStopPlacesByModeQueryVariables = Types.Exact<{
  authorities?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  transportModes?: Types.InputMaybe<Array<Types.InputMaybe<Types.TransportMode>> | Types.InputMaybe<Types.TransportMode>>;
}>;


export type GetStopPlacesByModeQuery = { lines: Array<{ transportSubmode?: Types.TransportSubmode, quays: Array<{ stopPlace?: { id: string, name: string, latitude?: number, longitude?: number } }> }> };


export const GetStopPlacesByModeDocument = gql`
    query getStopPlacesByMode($authorities: [String], $transportModes: [TransportMode]) {
  lines(authorities: $authorities, transportModes: $transportModes) {
    quays {
      stopPlace {
        ...stopPlace
      }
    }
    transportSubmode
  }
}
    ${StopPlaceFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getStopPlacesByMode(variables?: GetStopPlacesByModeQueryVariables, options?: C): Promise<GetStopPlacesByModeQuery> {
      return requester<GetStopPlacesByModeQuery, GetStopPlacesByModeQueryVariables>(GetStopPlacesByModeDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;