import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { TranslatedStringFragment, PricingPlanFragment, OperatorFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TranslatedStringFragmentDoc, PricingPlanFragmentDoc, OperatorFragmentDoc } from './shared.graphql-gen';
export type VehicleTypeFragment = { id: string, formFactor: Types.FormFactor, maxRangeMeters?: number, name?: TranslatedStringFragment };

export type RentalUrisFragment = { android?: string, ios?: string };

export type RentalAppFragment = { discoveryUri?: string, storeUri?: string };

export type RentalAppsFragment = { android?: RentalAppFragment, ios?: RentalAppFragment };

export type BrandAssetsFragment = { brandImageUrl: string, brandImageUrlDark?: string, brandLastModified: string };

export type VehicleFragment = { id: string, lat: number, lon: number, isReserved: boolean, isDisabled: boolean, currentRangeMeters: number, currentFuelPercent?: number, availableUntil?: string, vehicleType: VehicleTypeFragment, pricingPlan: PricingPlanFragment, system: { operator: OperatorFragment, name: TranslatedStringFragment, brandAssets?: BrandAssetsFragment, rentalApps?: RentalAppsFragment }, rentalUris?: RentalUrisFragment };

export const VehicleTypeFragmentDoc = gql`
    fragment vehicleType on VehicleType {
  id
  formFactor
  maxRangeMeters
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
export const RentalUrisFragmentDoc = gql`
    fragment rentalUris on RentalUris {
  android
  ios
}
    `;
export const VehicleFragmentDoc = gql`
    fragment vehicle on Vehicle {
  id
  lat
  lon
  isReserved
  isDisabled
  currentRangeMeters
  currentFuelPercent
  availableUntil
  vehicleType {
    ...vehicleType
  }
  pricingPlan {
    ...pricingPlan
  }
  system {
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
  rentalUris {
    ...rentalUris
  }
}
    ${VehicleTypeFragmentDoc}
${PricingPlanFragmentDoc}
${OperatorFragmentDoc}
${TranslatedStringFragmentDoc}
${BrandAssetsFragmentDoc}
${RentalAppsFragmentDoc}
${RentalUrisFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;