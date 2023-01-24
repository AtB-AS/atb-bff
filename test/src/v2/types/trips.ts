import { TripsQuery } from '../../../../src/service/impl/trips/journey-gql/trip.graphql-gen';

// Add 'compressedQuery' to the tripPattern
export type TripPatternWithCompressedQuery = TripsQuery['trip']['tripPatterns'][0] & {
  compressedQuery: string;
};

export type transportModesType = Array<{
  transportMode: string;
  transportSubModes?: string[];
}>;

export type tripsFiltersType = {
  [filter: string]: transportModesType;
};
