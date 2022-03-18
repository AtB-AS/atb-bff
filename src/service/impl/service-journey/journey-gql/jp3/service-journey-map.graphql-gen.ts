import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type MapInfoByServiceJourneyIdV2QueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
  fromQuayId: Types.Scalars['String'];
  toQuayId: Types.Scalars['String'];
}>;


export type MapInfoByServiceJourneyIdV2Query = { serviceJourney?: { pointsOnLink?: { length?: number, points?: string }, line: { transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } }, fromQuay?: { latitude?: number, longitude?: number }, toQuay?: { latitude?: number, longitude?: number } };


export const MapInfoByServiceJourneyIdV2Document = gql`
    query MapInfoByServiceJourneyIdV2($serviceJourneyId: String!, $fromQuayId: String!, $toQuayId: String!) {
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
    MapInfoByServiceJourneyIdV2(variables: MapInfoByServiceJourneyIdV2QueryVariables, options?: C): Promise<MapInfoByServiceJourneyIdV2Query> {
      return requester<MapInfoByServiceJourneyIdV2Query, MapInfoByServiceJourneyIdV2QueryVariables>(MapInfoByServiceJourneyIdV2Document, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;