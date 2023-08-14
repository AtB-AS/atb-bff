import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { StationBasicFragment, CarStationFragment, BikeStationFragment } from '../../fragments/mobility-gql/stations.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { StationBasicFragmentDoc, CarStationFragmentDoc, BikeStationFragmentDoc } from '../../fragments/mobility-gql/stations.graphql-gen';
export type GetStationsQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  availableFormFactors?: Types.InputMaybe<Array<Types.InputMaybe<Types.FormFactor>> | Types.InputMaybe<Types.FormFactor>>;
  operators?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;


export type GetStationsQuery = { stations?: Array<StationBasicFragment> };

export type GetStations_V2QueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  includeBicycles: Types.Scalars['Boolean'];
  bicycleOperators?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  includeCars: Types.Scalars['Boolean'];
  carOperators?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;


export type GetStations_V2Query = { bicycles?: Array<StationBasicFragment>, cars?: Array<StationBasicFragment> };

export type GetCarStationQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetCarStationQuery = { stations?: Array<CarStationFragment> };

export type GetBikeStationQueryVariables = Types.Exact<{
  ids?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type GetBikeStationQuery = { stations?: Array<BikeStationFragment> };


export const GetStationsDocument = gql`
    query getStations($lat: Float!, $lon: Float!, $range: Int!, $availableFormFactors: [FormFactor], $operators: [String]) {
  stations(
    lat: $lat
    lon: $lon
    range: $range
    availableFormFactors: $availableFormFactors
    operators: $operators
  ) {
    ...stationBasic
  }
}
    ${StationBasicFragmentDoc}`;
export const GetStations_V2Document = gql`
    query getStations_v2($lat: Float!, $lon: Float!, $range: Int!, $includeBicycles: Boolean!, $bicycleOperators: [String], $includeCars: Boolean!, $carOperators: [String]) {
  bicycles: stations(
    lat: $lat
    lon: $lon
    range: $range
    availableFormFactors: BICYCLE
    operators: $bicycleOperators
  ) @include(if: $includeBicycles) {
    ...stationBasic
  }
  cars: stations(
    lat: $lat
    lon: $lon
    range: $range
    availableFormFactors: CAR
    operators: $carOperators
  ) @include(if: $includeCars) {
    ...stationBasic
  }
}
    ${StationBasicFragmentDoc}`;
export const GetCarStationDocument = gql`
    query getCarStation($ids: [String!]) {
  stations(ids: $ids) {
    ...carStation
  }
}
    ${CarStationFragmentDoc}`;
export const GetBikeStationDocument = gql`
    query getBikeStation($ids: [String!]) {
  stations(ids: $ids) {
    ...bikeStation
  }
}
    ${BikeStationFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getStations(variables: GetStationsQueryVariables, options?: C): Promise<GetStationsQuery> {
      return requester<GetStationsQuery, GetStationsQueryVariables>(GetStationsDocument, variables, options);
    },
    getStations_v2(variables: GetStations_V2QueryVariables, options?: C): Promise<GetStations_V2Query> {
      return requester<GetStations_V2Query, GetStations_V2QueryVariables>(GetStations_V2Document, variables, options);
    },
    getCarStation(variables?: GetCarStationQueryVariables, options?: C): Promise<GetCarStationQuery> {
      return requester<GetCarStationQuery, GetCarStationQueryVariables>(GetCarStationDocument, variables, options);
    },
    getBikeStation(variables?: GetBikeStationQueryVariables, options?: C): Promise<GetBikeStationQuery> {
      return requester<GetBikeStationQuery, GetBikeStationQueryVariables>(GetBikeStationDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;