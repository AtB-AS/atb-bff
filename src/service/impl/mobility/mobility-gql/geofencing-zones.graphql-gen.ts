import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GetGeofencingZonesQueryVariables = Types.Exact<{
  systemIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>>;
}>;


export type GetGeofencingZonesQuery = { geofencingZones?: Array<{ systemId?: string, geojson?: { type?: string, features?: Array<{ type?: string, geometry?: { type?: string, coordinates?: Array<Array<Array<Array<number>>>> }, properties?: { name?: string, start?: number, end?: number, rules?: Array<{ vehicleTypeIds?: Array<string>, rideAllowed: boolean, rideThroughAllowed: boolean, maximumSpeedKph?: number, stationParking?: boolean }> } }> } }> };


export const GetGeofencingZonesDocument = gql`
    query getGeofencingZones($systemIds: [ID]) {
  geofencingZones(systemIds: $systemIds) {
    systemId
    geojson {
      type
      features {
        type
        geometry {
          type
          coordinates
        }
        properties {
          name
          start
          end
          rules {
            vehicleTypeIds
            rideAllowed
            rideThroughAllowed
            maximumSpeedKph
            stationParking
          }
        }
      }
    }
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getGeofencingZones(variables?: GetGeofencingZonesQueryVariables, options?: C): Promise<GetGeofencingZonesQuery> {
      return requester<GetGeofencingZonesQuery, GetGeofencingZonesQueryVariables>(GetGeofencingZonesDocument, variables, options) as Promise<GetGeofencingZonesQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;