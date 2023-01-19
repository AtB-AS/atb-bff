import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type OperatorFragment = { id: string, name: TranslatedStringFragment };

export type PricingPlanFragment = { price: number, perKmPricing?: Array<PricingSegmentFragment>, perMinPricing?: Array<PricingSegmentFragment> };

export type PricingSegmentFragment = { rate: number, end?: number, interval: number, start: number };

export type TranslatedStringFragment = { translation: Array<TranslationFragment> };

export type TranslationFragment = { language: string, value: string };

export const TranslationFragmentDoc = gql`
    fragment translation on Translation {
  language
  value
}
    `;
export const TranslatedStringFragmentDoc = gql`
    fragment translatedString on TranslatedString {
  translation {
    ...translation
  }
}
    ${TranslationFragmentDoc}`;
export const OperatorFragmentDoc = gql`
    fragment operator on Operator {
  id
  name {
    ...translatedString
  }
}
    ${TranslatedStringFragmentDoc}`;
export const PricingSegmentFragmentDoc = gql`
    fragment pricingSegment on PricingSegment {
  rate
  end
  interval
  start
}
    `;
export const PricingPlanFragmentDoc = gql`
    fragment pricingPlan on PricingPlan {
  perKmPricing {
    ...pricingSegment
  }
  price
  perMinPricing {
    ...pricingSegment
  }
}
    ${PricingSegmentFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;