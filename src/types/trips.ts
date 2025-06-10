import {
  TripsQuery,
  TripsQueryVariables,
} from '../service/impl/trips/journey-gql/trip.graphql-gen';
import {StreetMode} from '../graphql/journey/journeyplanner-types_v3';
import {
  TripFragment,
  TripPatternFragment,
} from '../service/impl/fragments/journey-gql/trips.graphql-gen';
import {
  BookingAvailabilityType,
  TicketOffer,
} from '../service/impl/trips/booking-utils';

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

export type BookingTraveller = {
  id: string;
  userType: string;
  count: number;
};
export type BookingTripsQueryParameters = {
  searchTime: string;
  fromStopPlaceId: string;
  toStopPlaceId: string;
};
export type BookingTripsQueryPayload = {
  travellers: BookingTraveller[];
  products: string[];
};
export type BookingTripsQuery = {
  trip: TripFragment & {
    tripPatterns: Array<TripPatternWithBooking>;
  };
};
export type TripPatternWithBooking = TripPatternFragment & {
  booking: {
    availability: BookingAvailabilityType;
    offer?: TicketOffer;
  };
};
