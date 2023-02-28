import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { TranslatedStringFragment, PricingPlanFragment, OperatorFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TranslatedStringFragmentDoc, PricingPlanFragmentDoc, OperatorFragmentDoc } from './shared.graphql-gen';
export type VehicleTypeFragment = { id: string, formFactor: Types.FormFactor, maxRangeMeters?: number, name?: TranslatedStringFragment };

export type RentalUrisFragment = { android?: string, ios?: string };

export type VehicleFragment = { id: string, lat: number, lon: number, isReserved: boolean, isDisabled: boolean, currentRangeMeters: number, currentFuelPercent?: number, availableUntil?: string, vehicleType: VehicleTypeFragment, pricingPlan: PricingPlanFragment, system: { operator: OperatorFragment, name: TranslatedStringFragment }, rentalUris?: RentalUrisFragment };

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
  }
  rentalUris {
    ...rentalUris
  }
}
    ${VehicleTypeFragmentDoc}
${PricingPlanFragmentDoc}
${OperatorFragmentDoc}
${TranslatedStringFragmentDoc}
${RentalUrisFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;