import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { VehicleTypeBasicFragment, PricingPlanFragment, SystemFragment, RentalUrisFragment, VehicleTypeFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleTypeBasicFragmentDoc, PricingPlanFragmentDoc, SystemFragmentDoc, RentalUrisFragmentDoc, VehicleTypeFragmentDoc } from './shared.graphql-gen';
export type VehicleBasicFragment = { id: string, lat: number, lon: number, currentFuelPercent?: number, currentRangeMeters: number, vehicleType: VehicleTypeBasicFragment };

export type VehicleExtendedFragment = (
  { isReserved: boolean, isDisabled: boolean, availableUntil?: string, pricingPlan: PricingPlanFragment, system: SystemFragment, rentalUris?: RentalUrisFragment, vehicleType: VehicleTypeFragment }
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
    ...vehicleTypeBasic
  }
}
    ${VehicleTypeBasicFragmentDoc}`;
export const VehicleExtendedFragmentDoc = gql`
    fragment vehicleExtended on Vehicle {
  ...vehicleBasic
  isReserved
  isDisabled
  availableUntil
  pricingPlan {
    ...pricingPlan
  }
  system {
    ...system
  }
  rentalUris {
    ...rentalUris
  }
  vehicleType {
    ...vehicleType
  }
}
    ${VehicleBasicFragmentDoc}
${PricingPlanFragmentDoc}
${SystemFragmentDoc}
${RentalUrisFragmentDoc}
${VehicleTypeFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;