import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type InterchangeFragment = { guaranteed?: boolean, maximumWaitTime?: number, staySeated?: boolean, fromServiceJourney?: { id: string, publicCode?: string, line: { publicCode?: string } }, toServiceJourney?: { id: string, publicCode?: string, line: { publicCode?: string } } };

export const InterchangeFragmentDoc = gql`
    fragment interchange on Interchange {
  fromServiceJourney {
    id
    publicCode
    line {
      publicCode
    }
  }
  toServiceJourney {
    id
    publicCode
    line {
      publicCode
    }
  }
  guaranteed
  maximumWaitTime
  staySeated
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;