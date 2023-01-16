import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type TranslationFragment = { language: string, value: string };

export const TranslationFragmentDoc = gql`
    fragment translation on Translation {
  language
  value
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;