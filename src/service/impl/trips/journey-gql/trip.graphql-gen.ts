import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import {TripFragment, TripFragmentDoc} from '../../fragments/journey-gql/trips.graphql-gen';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean'];
  when?: Types.InputMaybe<Types.Scalars['DateTime']>;
  cursor?: Types.InputMaybe<Types.Scalars['String']>;
  transferPenalty?: Types.InputMaybe<Types.Scalars['Int']>;
  waitReluctance?: Types.InputMaybe<Types.Scalars['Float']>;
  walkReluctance?: Types.InputMaybe<Types.Scalars['Float']>;
  walkSpeed?: Types.InputMaybe<Types.Scalars['Float']>;
  modes?: Types.InputMaybe<Types.Modes>;
  numTripPatterns?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type TripsQuery = { trip: TripFragment };


export const TripsDocument = gql`
    query Trips($from: Location!, $to: Location!, $arriveBy: Boolean!, $when: DateTime, $cursor: String, $transferPenalty: Int, $waitReluctance: Float, $walkReluctance: Float, $walkSpeed: Float, $modes: Modes, $numTripPatterns: Int) {
  trip(
    from: $from
    to: $to
    dateTime: $when
    arriveBy: $arriveBy
    pageCursor: $cursor
    transferPenalty: $transferPenalty
    waitReluctance: $waitReluctance
    walkReluctance: $walkReluctance
    walkSpeed: $walkSpeed
    modes: $modes
    numTripPatterns: $numTripPatterns
  ) {
    ...trip
  }
}
    ${TripFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    Trips(variables: TripsQueryVariables, options?: C): Promise<TripsQuery> {
      return requester<TripsQuery, TripsQueryVariables>(TripsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;