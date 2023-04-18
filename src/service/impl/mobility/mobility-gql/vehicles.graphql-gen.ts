import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { VehicleBasicFragment, VehicleExtendedFragment } from '../../fragments/mobility-gql/vehicles.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { VehicleBasicFragmentDoc, VehicleExtendedFragmentDoc } from '../../fragments/mobility-gql/vehicles.graphql-gen';
export type GetVehiclesBasicQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  formFactors?: Types.InputMaybe<Array<Types.InputMaybe<Types.FormFactor>> | Types.InputMaybe<Types.FormFactor>>;
}>;


export type GetVehiclesBasicQuery = { vehicles?: Array<VehicleBasicFragment> };

export type GetVehiclesExtendedQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  formFactors?: Types.InputMaybe<Array<Types.InputMaybe<Types.FormFactor>> | Types.InputMaybe<Types.FormFactor>>;
}>;


export type GetVehiclesExtendedQuery = { vehicles?: Array<VehicleExtendedFragment> };


export const GetVehiclesBasicDocument = gql`
    query getVehiclesBasic($lat: Float!, $lon: Float!, $range: Int!, $formFactors: [FormFactor]) {
  vehicles(lat: $lat, lon: $lon, range: $range, formFactors: $formFactors) {
    ...vehicleBasic
  }
}
    ${VehicleBasicFragmentDoc}`;
export const GetVehiclesExtendedDocument = gql`
    query getVehiclesExtended($lat: Float!, $lon: Float!, $range: Int!, $formFactors: [FormFactor]) {
  vehicles(lat: $lat, lon: $lon, range: $range, formFactors: $formFactors) {
    ...vehicleExtended
  }
}
    ${VehicleExtendedFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getVehiclesBasic(variables: GetVehiclesBasicQueryVariables, options?: C): Promise<GetVehiclesBasicQuery> {
      return requester<GetVehiclesBasicQuery, GetVehiclesBasicQueryVariables>(GetVehiclesBasicDocument, variables, options);
    },
    getVehiclesExtended(variables: GetVehiclesExtendedQueryVariables, options?: C): Promise<GetVehiclesExtendedQuery> {
      return requester<GetVehiclesExtendedQuery, GetVehiclesExtendedQueryVariables>(GetVehiclesExtendedDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;