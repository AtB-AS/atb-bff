import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { QuayFragment } from './quays.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { QuayFragmentDoc } from './quays.graphql-gen';
export type JourneyPatternsFragment = { quays: Array<QuayFragment>, line: { transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, authority?: { id: string } } };

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
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;