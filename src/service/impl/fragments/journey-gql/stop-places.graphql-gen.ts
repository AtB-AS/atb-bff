import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type StopPlaceFragment = { id: string, name: string, latitude?: number, longitude?: number, transportMode?: Array<Types.TransportMode> };

export const StopPlaceFragmentDoc = gql`
    fragment stopPlace on StopPlace {
  id
  name
  latitude
  longitude
  transportMode
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;