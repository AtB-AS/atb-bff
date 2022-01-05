import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type MapDataQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
  fromQuayId: Types.Scalars['String'];
  toQuayId: Types.Scalars['String'];
}>;


export type MapDataQuery = { serviceJourney?: Types.Maybe<{ pointsOnLink?: Types.Maybe<{ length?: Types.Maybe<number>, points?: Types.Maybe<string> }>, line: { transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode> } }>, fromQuay?: Types.Maybe<{ latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number> }>, toQuay?: Types.Maybe<{ latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number> }> };


export const MapDataDocument = gql`
    query MapData($serviceJourneyId: String!, $fromQuayId: String!, $toQuayId: String!) {
  serviceJourney(id: $serviceJourneyId) {
    pointsOnLink {
      length
      points
    }
    line {
      transportMode
      transportSubmode
    }
  }
  fromQuay: quay(id: $fromQuayId) {
    latitude
    longitude
  }
  toQuay: quay(id: $toQuayId) {
    latitude
    longitude
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    MapData(variables: MapDataQueryVariables, options?: C): Promise<MapDataQuery> {
      return requester<MapDataQuery, MapDataQueryVariables>(MapDataDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;