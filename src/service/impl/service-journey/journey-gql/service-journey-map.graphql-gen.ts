import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type MapInfoWithFromAndToQuayV2QueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String']['input'];
  fromQuayId: Types.Scalars['String']['input'];
  toQuayId: Types.Scalars['String']['input'];
}>;


export type MapInfoWithFromAndToQuayV2Query = { serviceJourney?: { pointsOnLink?: { length?: number, points?: string }, line: { transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } }, fromQuay?: { latitude?: number, longitude?: number }, toQuay?: { latitude?: number, longitude?: number } };

export type MapInfoWithFromQuayV2QueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String']['input'];
  fromQuayId: Types.Scalars['String']['input'];
}>;


export type MapInfoWithFromQuayV2Query = { serviceJourney?: { pointsOnLink?: { length?: number, points?: string }, line: { transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } }, fromQuay?: { latitude?: number, longitude?: number } };


export const MapInfoWithFromAndToQuayV2Document = gql`
    query MapInfoWithFromAndToQuayV2($serviceJourneyId: String!, $fromQuayId: String!, $toQuayId: String!) {
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
export const MapInfoWithFromQuayV2Document = gql`
    query MapInfoWithFromQuayV2($serviceJourneyId: String!, $fromQuayId: String!) {
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
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    MapInfoWithFromAndToQuayV2(variables: MapInfoWithFromAndToQuayV2QueryVariables, options?: C): Promise<MapInfoWithFromAndToQuayV2Query> {
      return requester<MapInfoWithFromAndToQuayV2Query, MapInfoWithFromAndToQuayV2QueryVariables>(MapInfoWithFromAndToQuayV2Document, variables, options) as Promise<MapInfoWithFromAndToQuayV2Query>;
    },
    MapInfoWithFromQuayV2(variables: MapInfoWithFromQuayV2QueryVariables, options?: C): Promise<MapInfoWithFromQuayV2Query> {
      return requester<MapInfoWithFromQuayV2Query, MapInfoWithFromQuayV2QueryVariables>(MapInfoWithFromQuayV2Document, variables, options) as Promise<MapInfoWithFromQuayV2Query>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;