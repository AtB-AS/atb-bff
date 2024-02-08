import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type MultilingualStringFragment = { language?: string, value: string };

export type InfoLinkFragment = { uri: string, label?: string };

export type ValidityPeriodFragment = { startTime?: any, endTime?: any };

export const MultilingualStringFragmentDoc = gql`
    fragment multilingualString on MultilingualString {
  language
  value
}
    `;
export const InfoLinkFragmentDoc = gql`
    fragment infoLink on infoLink {
  uri
  label
}
    `;
export const ValidityPeriodFragmentDoc = gql`
    fragment validityPeriod on ValidityPeriod {
  startTime
  endTime
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;