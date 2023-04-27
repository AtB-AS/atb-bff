import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { VehicleRangeFragment, VehicleTypeFragment, PricingPlanFragment, SystemFragment, RentalUrisFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleRangeFragmentDoc, VehicleTypeFragmentDoc, PricingPlanFragmentDoc, SystemFragmentDoc, RentalUrisFragmentDoc } from './shared.graphql-gen';
export type VehicleBasicFragment = { id: string, lat: number, lon: number, currentFuelPercent?: number, currentRangeMeters: number, vehicleType: VehicleRangeFragment };

export type VehicleExtendedFragment = (
  { isReserved: boolean, isDisabled: boolean, availableUntil?: string, vehicleType: VehicleTypeFragment, pricingPlan: PricingPlanFragment, system: SystemFragment, rentalUris?: RentalUrisFragment }
  & VehicleBasicFragment
);

export const VehicleBasicFragmentDoc = gql`
    fragment vehicleBasic on Vehicle {
  id
  lat
  lon
  currentFuelPercent
  currentRangeMeters
  vehicleType {
    ...vehicleRange
  }
}
    ${VehicleRangeFragmentDoc}`;
export const VehicleExtendedFragmentDoc = gql`
    fragment vehicleExtended on Vehicle {
  ...vehicleBasic
  isReserved
  isDisabled
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
    ${VehicleBasicFragmentDoc}
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