import * as Types from '../../../../graphql/journey-types';

import gql from 'graphql-tag';

export type MapInfoByServiceJourneyIdQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
  fromQuayId: Types.Scalars['String'];
  toQuayId: Types.Scalars['String'];
}>;


export type MapInfoByServiceJourneyIdQuery = { serviceJourney?: Types.Maybe<{ pointsOnLink?: Types.Maybe<{ length?: Types.Maybe<number>, points?: Types.Maybe<string> }>, line: { transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode> } }>, fromQuay?: Types.Maybe<{ latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number> }>, toQuay?: Types.Maybe<{ latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number> }> };


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