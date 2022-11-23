import { TripsQuery } from '../../../../src/service/impl/trips/graphql/jp3/trip.graphql-gen';

// Add 'compressedQuery' to the tripPattern
export type TripPatternWithCompressedQuery = TripsQuery['trip']['tripPatterns'][0] & {
  compressedQuery: string;
};