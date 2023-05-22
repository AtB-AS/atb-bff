import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { VehicleBasicFragment, VehicleExtendedFragment } from '../../fragments/mobility-gql/vehicles.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleBasicFragmentDoc, VehicleExtendedFragmentDoc } from '../../fragments/mobility-gql/vehicles.graphql-gen';
export type GetVehiclesQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  formFactors?: Types.InputMaybe<Array<Types.InputMaybe<Types.FormFactor>> | Types.InputMaybe<Types.FormFactor>>;
  operators?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;


export type GetVehiclesQuery = { vehicles?: Array<VehicleBasicFragment> };

export type GetVehicleQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetVehicleQuery = { vehicles?: Array<VehicleExtendedFragment> };


export const GetVehiclesDocument = gql`
    query getVehicles($lat: Float!, $lon: Float!, $range: Int!, $formFactors: [FormFactor], $operators: [String]) {
  vehicles(
    lat: $lat
    lon: $lon
    range: $range
    formFactors: $formFactors
    operators: $operators
  ) {
    ...vehicleBasic
  }
}
    ${VehicleBasicFragmentDoc}`;
export const GetVehicleDocument = gql`
    query getVehicle($ids: [String!]) {
  vehicles(ids: $ids) {
    ...vehicleExtended
  }
}
    ${VehicleExtendedFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getVehicles(variables: GetVehiclesQueryVariables, options?: C): Promise<GetVehiclesQuery> {
      return requester<GetVehiclesQuery, GetVehiclesQueryVariables>(GetVehiclesDocument, variables, options);
    },
    getVehicle(variables?: GetVehicleQueryVariables, options?: C): Promise<GetVehicleQuery> {
      return requester<GetVehicleQuery, GetVehicleQueryVariables>(GetVehicleDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;