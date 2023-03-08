import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { TranslatedStringFragment, PricingPlanFragment, OperatorFragment } from './shared.graphql-gen';
import { BrandAssetsFragment, RentalAppsFragment, RentalUrisFragment } from './vehicles.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TranslatedStringFragmentDoc, PricingPlanFragmentDoc, OperatorFragmentDoc } from './shared.graphql-gen';
import { BrandAssetsFragmentDoc, RentalAppsFragmentDoc, RentalUrisFragmentDoc } from './vehicles.graphql-gen';
export type StationFragment = { id: string, lat: number, lon: number, capacity?: number, numBikesAvailable: number, numDocksAvailable?: number, name: TranslatedStringFragment, pricingPlans: Array<PricingPlanFragment>, system: { operator: OperatorFragment, name: TranslatedStringFragment, brandAssets?: BrandAssetsFragment, rentalApps?: RentalAppsFragment }, rentalUris?: RentalUrisFragment };

export const StationFragmentDoc = gql`
    fragment station on Station {
  id
  lat
  lon
  name {
    ...translatedString
  }
  capacity
  numBikesAvailable
  numDocksAvailable
  pricingPlans {
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
    ${TranslatedStringFragmentDoc}
${PricingPlanFragmentDoc}
${OperatorFragmentDoc}
${BrandAssetsFragmentDoc}
${RentalAppsFragmentDoc}
${RentalUrisFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;