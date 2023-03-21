import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { TranslatedStringFragment, PricingPlanFragment, SystemFragment, RentalUrisFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TranslatedStringFragmentDoc, PricingPlanFragmentDoc, SystemFragmentDoc, RentalUrisFragmentDoc } from './shared.graphql-gen';
export type StationFragment = { id: string, lat: number, lon: number, capacity?: number, numBikesAvailable: number, numDocksAvailable?: number, name: TranslatedStringFragment, pricingPlans: Array<PricingPlanFragment>, system: SystemFragment, rentalUris?: RentalUrisFragment };

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
    ...system
  }
  rentalUris {
    ...rentalUris
  }
}
    ${TranslatedStringFragmentDoc}
${PricingPlanFragmentDoc}
${SystemFragmentDoc}
${RentalUrisFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;