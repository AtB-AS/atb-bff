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
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;