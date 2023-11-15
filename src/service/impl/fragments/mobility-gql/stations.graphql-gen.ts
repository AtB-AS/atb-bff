import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { TranslatedStringFragment, PricingPlanFragment, SystemFragment, RentalUrisFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TranslatedStringFragmentDoc, PricingPlanFragmentDoc, SystemFragmentDoc, RentalUrisFragmentDoc } from './shared.graphql-gen';
export type VehicleTypeAvailabilityBasicFragment = { count: number, vehicleType: { formFactor: Types.FormFactor } };

export type StationBasicFragment = { id: string, lat: number, lon: number, capacity?: number, vehicleTypesAvailable?: Array<VehicleTypeAvailabilityBasicFragment> };

export type BikeStationFragment = (
  { numDocksAvailable?: number, name: TranslatedStringFragment, pricingPlans: Array<PricingPlanFragment>, system: SystemFragment, rentalUris?: RentalUrisFragment }
  & StationBasicFragment
);

export type CarVehicleTypeFragment = { formFactor: Types.FormFactor, propulsionType: Types.PropulsionType, maxRangeMeters?: number, riderCapacity?: number, make?: string, model?: string, vehicleAccessories?: Array<Types.VehicleAccessory>, vehicleImage?: string, name?: TranslatedStringFragment };

export type CarAvailabilityFragment = { count: number, vehicleType: CarVehicleTypeFragment };

export type CarStationFragment = (
  { name: TranslatedStringFragment, pricingPlans: Array<PricingPlanFragment>, system: SystemFragment, rentalUris?: RentalUrisFragment, vehicleTypesAvailable?: Array<CarAvailabilityFragment> }
  & StationBasicFragment
);

export const VehicleTypeAvailabilityBasicFragmentDoc = gql`
    fragment vehicleTypeAvailabilityBasic on VehicleTypeAvailability {
  count
  vehicleType {
    formFactor
  }
}
    `;
export const StationBasicFragmentDoc = gql`
    fragment stationBasic on Station {
  id
  lat
  lon
  capacity
  vehicleTypesAvailable {
    ...vehicleTypeAvailabilityBasic
  }
}
    ${VehicleTypeAvailabilityBasicFragmentDoc}`;
export const BikeStationFragmentDoc = gql`
    fragment bikeStation on Station {
  ...stationBasic
  numDocksAvailable
  name {
    ...translatedString
  }
  pricingPlans {
    ...pricingPlan
  }
  system {
    ...system
  }
  rentalUris {
    ...rentalUris
  }
}
    ${StationBasicFragmentDoc}
${TranslatedStringFragmentDoc}
${PricingPlanFragmentDoc}
${SystemFragmentDoc}
${RentalUrisFragmentDoc}`;
export const CarVehicleTypeFragmentDoc = gql`
    fragment carVehicleType on VehicleType {
  formFactor
  propulsionType
  maxRangeMeters
  riderCapacity
  make
  model
  name {
    ...translatedString
  }
  vehicleAccessories
  vehicleImage
}
    ${TranslatedStringFragmentDoc}`;
export const CarAvailabilityFragmentDoc = gql`
    fragment carAvailability on VehicleTypeAvailability {
  count
  vehicleType {
    ...carVehicleType
  }
}
    ${CarVehicleTypeFragmentDoc}`;
export const CarStationFragmentDoc = gql`
    fragment carStation on Station {
  ...stationBasic
  name {
    ...translatedString
  }
  pricingPlans {
    ...pricingPlan
  }
  system {
    ...system
  }
  rentalUris {
    ...rentalUris
  }
  vehicleTypesAvailable {
    ...carAvailability
  }
}
    ${StationBasicFragmentDoc}
${TranslatedStringFragmentDoc}
${PricingPlanFragmentDoc}
${SystemFragmentDoc}
${RentalUrisFragmentDoc}
${CarAvailabilityFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;