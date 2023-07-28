import {
  TripsQuery,
  TripsQueryVariables,
} from '../service/impl/trips/journey-gql/trip.graphql-gen';
import {StreetMode} from '../graphql/journey/journeyplanner-types_v3';

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

export type NonTransitTripsQueryVariables = Omit<
  TripsQueryVariables,
  | 'cursor'
  | 'transferPenalty'
  | 'waitReluctance'
  | 'walkReluctance'
  | 'numTripPatterns'
  | 'modes'
> & {
  directModes: StreetMode[];
};
