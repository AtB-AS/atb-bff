import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { QuayFragmentDoc } from './quays.graphql-gen';
export type JourneyPatternsFragment = { quays: Array<{ id: string, name: string, publicCode?: string, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> }>, line: { transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, authority?: { id: string } } };

export const JourneyPatternsFragmentDoc = gql`
    fragment journeyPatterns on JourneyPattern {
  quays {
    ...quay
  }
  line {
    transportMode
    transportSubmode
    authority {
      id
    }
  }
}
    ${QuayFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;