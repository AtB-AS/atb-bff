import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type OperatorFragment = { id: string, name: TranslatedStringFragment };

export type PricingPlanFragment = { price: number, perKmPricing?: Array<PricingSegmentFragment>, perMinPricing?: Array<PricingSegmentFragment> };

export type PricingSegmentFragment = { rate: number, end?: number, interval: number, start: number };

export type TranslatedStringFragment = { translation: Array<TranslationFragment> };

export type TranslationFragment = { language: string, value: string };

export type RentalUrisFragment = { android?: string, ios?: string };

export type RentalAppFragment = { discoveryUri?: string, storeUri?: string };

export type RentalAppsFragment = { android?: RentalAppFragment, ios?: RentalAppFragment };

export type BrandAssetsFragment = { brandImageUrl: string, brandImageUrlDark?: string, brandLastModified: string };

export type SystemFragment = { id: string, openingHours?: string, operator: OperatorFragment, name: TranslatedStringFragment, brandAssets?: BrandAssetsFragment, rentalApps?: RentalAppsFragment };

export type VehicleTypeBasicFragment = { maxRangeMeters?: number, formFactor: Types.FormFactor };

export type VehicleTypeFragment = (
  { id: string, propulsionType: Types.PropulsionType, name?: TranslatedStringFragment }
  & VehicleTypeBasicFragment
);

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
export const RentalUrisFragmentDoc = gql`
    fragment rentalUris on RentalUris {
  android
  ios
}
    `;
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
export const BrandAssetsFragmentDoc = gql`
    fragment brandAssets on BrandAssets {
  brandImageUrl
  brandImageUrlDark
  brandLastModified
}
    `;
export const RentalAppFragmentDoc = gql`
    fragment rentalApp on RentalApp {
  discoveryUri
  storeUri
}
    `;
export const RentalAppsFragmentDoc = gql`
    fragment rentalApps on RentalApps {
  android {
    ...rentalApp
  }
  ios {
    ...rentalApp
  }
}
    ${RentalAppFragmentDoc}`;
export const SystemFragmentDoc = gql`
    fragment system on System {
  id
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
  openingHours
}
    ${OperatorFragmentDoc}
${TranslatedStringFragmentDoc}
${BrandAssetsFragmentDoc}
${RentalAppsFragmentDoc}`;
export const VehicleTypeBasicFragmentDoc = gql`
    fragment vehicleTypeBasic on VehicleType {
  maxRangeMeters
  formFactor
}
    `;
export const VehicleTypeFragmentDoc = gql`
    fragment vehicleType on VehicleType {
  ...vehicleTypeBasic
  id
  propulsionType
  name {
    ...translatedString
  }
}
    ${VehicleTypeBasicFragmentDoc}
${TranslatedStringFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;