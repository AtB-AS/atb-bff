import * as Types from '../../../../graphql/vehicles/vehicles-types_v2';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type VehicleFragment = { mode?: Types.VehicleModeEnumeration, lastUpdated?: any, bearing?: number, serviceJourney?: { id: string }, location?: { latitude: number, longitude: number }, progressBetweenStops?: { percentage?: number, linkDistance?: number }, monitoredCall?: { stopPointRef?: string, vehicleAtStop?: boolean } };

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
  progressBetweenStops {
    percentage
    linkDistance
  }
  monitoredCall {
    stopPointRef
    vehicleAtStop
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;