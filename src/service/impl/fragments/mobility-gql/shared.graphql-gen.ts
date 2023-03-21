import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { BrandAssetsFragment, RentalAppsFragment } from './vehicles.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { BrandAssetsFragmentDoc, RentalAppsFragmentDoc } from './vehicles.graphql-gen';
export type OperatorFragment = { id: string, name: TranslatedStringFragment };

export type PricingPlanFragment = { price: number, perKmPricing?: Array<PricingSegmentFragment>, perMinPricing?: Array<PricingSegmentFragment> };

export type PricingSegmentFragment = { rate: number, end?: number, interval: number, start: number };

export type TranslatedStringFragment = { translation: Array<TranslationFragment> };

export type TranslationFragment = { language: string, value: string };

export type SystemFragment = { operator: OperatorFragment, name: TranslatedStringFragment, brandAssets?: BrandAssetsFragment, rentalApps?: RentalAppsFragment };

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
export const SystemFragmentDoc = gql`
    fragment system on System {
  operator {
    ...operator
  }
  name {
    ...translatedString
  }
  brandAssets {
    ...brandAssets
  }
  rentalApps {
    ...rentalApps
  }
}
    ${OperatorFragmentDoc}
${TranslatedStringFragmentDoc}
${BrandAssetsFragmentDoc}
${RentalAppsFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;