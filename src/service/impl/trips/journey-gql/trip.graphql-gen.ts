import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { TripFragment } from '../../fragments/journey-gql/trips.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { TripFragmentDoc } from '../../fragments/journey-gql/trips.graphql-gen';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean']['input'];
  when?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  cursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  transferSlack?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  transferPenalty?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  waitReluctance?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  walkReluctance?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  walkSpeed?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  modes?: Types.InputMaybe<Types.Modes>;
  numTripPatterns?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  searchWindow?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type TripsQuery = { trip: TripFragment };

export type TripsNonTransitQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean']['input'];
  when?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  walkSpeed?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  includeFoot: Types.Scalars['Boolean']['input'];
  includeBicycle: Types.Scalars['Boolean']['input'];
  includeBikeRental: Types.Scalars['Boolean']['input'];
}>;


export type TripsNonTransitQuery = { footTrip: TripFragment, bikeRentalTrip: TripFragment, bicycleTrip: TripFragment };


export const TripsDocument = gql`
    query Trips($from: Location!, $to: Location!, $arriveBy: Boolean!, $when: DateTime, $cursor: String, $transferSlack: Int, $transferPenalty: Int, $waitReluctance: Float, $walkReluctance: Float, $walkSpeed: Float, $modes: Modes, $numTripPatterns: Int, $searchWindow: Int) {
  trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    pageCursor: $cursor
    transferSlack: $transferSlack
    transferPenalty: $transferPenalty
    waitReluctance: $waitReluctance
    walkReluctance: $walkReluctance
    walkSpeed: $walkSpeed
    modes: $modes
    numTripPatterns: $numTripPatterns
    searchWindow: $searchWindow
  ) {
    ...trip
  }
}
    ${TripFragmentDoc}`;
export const TripsNonTransitDocument = gql`
    query TripsNonTransit($from: Location!, $to: Location!, $arriveBy: Boolean!, $when: DateTime, $walkSpeed: Float, $includeFoot: Boolean!, $includeBicycle: Boolean!, $includeBikeRental: Boolean!) {
  footTrip: trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    walkSpeed: $walkSpeed
    modes: {directMode: foot, transportModes: []}
  ) @include(if: $includeFoot) {
    ...trip
  }
  bikeRentalTrip: trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    walkSpeed: $walkSpeed
    modes: {directMode: bike_rental, transportModes: []}
  ) @include(if: $includeBikeRental) {
    ...trip
  }
  bicycleTrip: trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    walkSpeed: $walkSpeed
    modes: {directMode: bicycle, transportModes: []}
  ) @include(if: $includeBicycle) {
    ...trip
  }
}
    ${TripFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    Trips(variables: TripsQueryVariables, options?: C): Promise<TripsQuery> {
      return requester<TripsQuery, TripsQueryVariables>(TripsDocument, variables, options) as Promise<TripsQuery>;
    },
    TripsNonTransit(variables: TripsNonTransitQueryVariables, options?: C): Promise<TripsNonTransitQuery> {
      return requester<TripsNonTransitQuery, TripsNonTransitQueryVariables>(TripsNonTransitDocument, variables, options) as Promise<TripsNonTransitQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;