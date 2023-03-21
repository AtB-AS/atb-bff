import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { TranslatedStringFragment, PricingPlanFragment, SystemFragment, RentalUrisFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TranslatedStringFragmentDoc, PricingPlanFragmentDoc, SystemFragmentDoc, RentalUrisFragmentDoc } from './shared.graphql-gen';
export type VehicleTypeFragment = { id: string, formFactor: Types.FormFactor, maxRangeMeters?: number, name?: TranslatedStringFragment };

export type VehicleFragment = { id: string, lat: number, lon: number, isReserved: boolean, isDisabled: boolean, currentRangeMeters: number, currentFuelPercent?: number, availableUntil?: string, vehicleType: VehicleTypeFragment, pricingPlan: PricingPlanFragment, system: SystemFragment, rentalUris?: RentalUrisFragment };

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
    ...system
  }
  rentalUris {
    ...rentalUris
  }
}
    ${VehicleTypeFragmentDoc}
${PricingPlanFragmentDoc}
${SystemFragmentDoc}
${RentalUrisFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;