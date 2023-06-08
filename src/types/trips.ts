import {
  TripsQuery,
  TripsQueryVariables,
} from '../service/impl/trips/journey-gql/trip.graphql-gen';

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
