import * as Types from '../../../../graphql/vehicles/vehicles-types_v1';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type VehicleFragment = { mode?: Types.VehicleModeEnumeration, lastUpdated?: any, bearing?: number, serviceJourney?: { id: string }, location?: { latitude: number, longitude: number } };

export const VehicleFragmentDoc = gql`
    fragment Vehicle on VehicleUpdate {
  serviceJourney {
    id
  }
  mode
  lastUpdated
  bearing
  location {
    latitude
    longitude
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;