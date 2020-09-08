import * as Types from '../../../graphql/types';

import gql from 'graphql-tag';

export type GetStopPlacesByBboxQueryVariables = Types.Exact<{
  minLat: Types.Scalars['Float'];
  maxLat: Types.Scalars['Float'];
  minLng: Types.Scalars['Float'];
  maxLng: Types.Scalars['Float'];
  filterByInUse: Types.Scalars['Boolean'];
}>;


export type GetStopPlacesByBboxQuery = { stopPlacesByBbox: Array<Types.Maybe<{ id: string, latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number>, name: string, quays?: Types.Maybe<Array<Types.Maybe<{ id: string, name: string, longitude?: Types.Maybe<number>, latitude?: Types.Maybe<number>, stopPlace?: Types.Maybe<{ transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode>, id: string, latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number>, name: string }> }>>> }>> };


export const GetStopPlacesByBboxDocument = gql`
    query GetStopPlacesByBbox($minLat: Float!, $maxLat: Float!, $minLng: Float!, $maxLng: Float!, $filterByInUse: Boolean!) {
  stopPlacesByBbox(minimumLatitude: $minLat, maximumLatitude: $maxLat, minimumLongitude: $minLng, maximumLongitude: $maxLng, filterByInUse: $filterByInUse) {
    id
    latitude
    longitude
    name
    quays(filterByInUse: $filterByInUse) {
      id
      name
      longitude
      latitude
      stopPlace {
        transportMode
        transportSubmode
        id
        latitude
        longitude
        name
      }
    }
  }
}
    `;