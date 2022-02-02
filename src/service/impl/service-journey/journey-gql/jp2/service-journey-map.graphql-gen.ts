import * as Types from '../../../../../graphql/journey-types';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type MapInfoByServiceJourneyIdQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
  fromQuayId: Types.Scalars['String'];
  toQuayId: Types.Scalars['String'];
}>;


export type MapInfoByServiceJourneyIdQuery = { serviceJourney?: { pointsOnLink?: { length?: number, points?: string }, line: { transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } }, fromQuay?: { latitude?: number, longitude?: number }, toQuay?: { latitude?: number, longitude?: number } };


export const MapInfoByServiceJourneyIdDocument = gql`
    query MapInfoByServiceJourneyId($serviceJourneyId: String!, $fromQuayId: String!, $toQuayId: String!) {
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
    MapInfoByServiceJourneyId(variables: MapInfoByServiceJourneyIdQueryVariables, options?: C): Promise<MapInfoByServiceJourneyIdQuery> {
      return requester<MapInfoByServiceJourneyIdQuery, MapInfoByServiceJourneyIdQueryVariables>(MapInfoByServiceJourneyIdDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;