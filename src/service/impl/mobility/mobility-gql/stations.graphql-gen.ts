import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { StationBasicFragment, CarStationFragment } from '../../fragments/mobility-gql/stations.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { StationBasicFragmentDoc, CarStationFragmentDoc } from '../../fragments/mobility-gql/stations.graphql-gen';
export type GetStationsQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  availableFormFactors?: Types.InputMaybe<Array<Types.InputMaybe<Types.FormFactor>> | Types.InputMaybe<Types.FormFactor>>;
}>;


export type GetStationsQuery = { stations?: Array<StationBasicFragment> };

export type GetCarStationQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetCarStationQuery = { stationsById?: Array<CarStationFragment> };


export const GetStationsDocument = gql`
    query getStations($lat: Float!, $lon: Float!, $range: Int!, $availableFormFactors: [FormFactor]) {
  stations(
    lat: $lat
    lon: $lon
    range: $range
    availableFormFactors: $availableFormFactors
  ) {
    ...stationBasic
  }
}
    ${StationBasicFragmentDoc}`;
export const GetCarStationDocument = gql`
    query getCarStation($ids: [String]!) {
  stationsById(ids: $ids) {
    ...carStation
  }
}
    ${CarStationFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getStations(variables: GetStationsQueryVariables, options?: C): Promise<GetStationsQuery> {
      return requester<GetStationsQuery, GetStationsQueryVariables>(GetStationsDocument, variables, options);
    },
    getCarStation(variables: GetCarStationQueryVariables, options?: C): Promise<GetCarStationQuery> {
      return requester<GetCarStationQuery, GetCarStationQueryVariables>(GetCarStationDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;