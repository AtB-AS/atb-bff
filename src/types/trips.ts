import {
  TripsQuery,
  TripsQueryVariables,
} from '../service/impl/trips/journey-gql/trip.graphql-gen';
import {StreetMode} from '../graphql/journey/journeyplanner-types_v3';
import {TripFragment} from '../service/impl/fragments/journey-gql/trips.graphql-gen';

export type TripPattern = Required<TripsQuery>['trip']['tripPatterns'][0] & {
  id?: any;
};

export type TripsQueryWithJourneyIds = {
  query: TripsQueryVariables;
  journeyIds: string[];
};

export type CompressedSingleTripQuery = {
  compressedQuery: string;
};

export type DirectTripsQueryVariables = TripsQueryVariables & {
  modes: StreetMode[];
};

export type DirectTripsQuery = {
  mode: StreetMode;
  trip: TripFragment;
};
