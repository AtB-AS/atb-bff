import * as Types from '../../../graphql/types';

import gql from 'graphql-tag';

export type MapInfoByServiceJourneyIdQueryVariables = Types.Exact<{
  serviceJourneyId: Types.Scalars['String'];
  currentQuayId: Types.Scalars['String'];
}>;


export type MapInfoByServiceJourneyIdQuery = { serviceJourney?: Types.Maybe<{ pointsOnLink?: Types.Maybe<{ length?: Types.Maybe<number>, points?: Types.Maybe<string> }>, line: { transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode> } }>, quay?: Types.Maybe<{ latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number> }> };


export const MapInfoByServiceJourneyIdDocument = gql`
    query MapInfoByServiceJourneyId($serviceJourneyId: String!, $currentQuayId: String!) {
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
  quay(id: $currentQuayId) {
    latitude
    longitude
  }
}
    `;