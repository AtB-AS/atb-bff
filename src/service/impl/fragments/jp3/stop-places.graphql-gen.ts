import * as Types from '../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type StopPlaceFragment = { id: string, name: string, latitude?: number, longitude?: number };

export const StopPlaceFragmentDoc = gql`
    fragment stopPlace on StopPlace {
  id
  name
  latitude
  longitude
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;