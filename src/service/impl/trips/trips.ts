import {
  TripsDocument,
  TripsQuery,
  TripsQueryVariables
} from './graphql/jp3/trip.graphql-gen';
import { Result } from '@badrap/result';
import { APIError } from '../../types';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';


import * as Boom from "@hapi/boom";
import {extractServiceJourneyIds} from "../../../utils/journey-utils";
import * as Trips from "../../../types/trips";

export async function getTrips(
  query: Trips.TripsQueryVariables
): Promise<Result<TripsQuery, APIError>> {
  try {
    const result = await journeyPlannerClient_v3.query<
      TripsQuery,
      TripsQueryVariables
    >({ query: TripsDocument, variables: query });

    if (result.errors) {
      return Result.err(new APIError(result.errors));
    }
    return Result.ok(mapTripsData(result.data));
  } catch (error) {
    console.log('error: ', error);
    return Result.err(new APIError(error));
  }
}

export async function getSingleTrip(query: Trips.TripsQueryWithJourneyIds): Promise<Result<Trips.TripPattern, APIError>> {

  const results = await journeyPlannerClient_v3.query<TripsQuery, TripsQueryVariables>(
    {query: TripsDocument, variables: query.query}
  );

  if (results.errors) {
    return Result.err(new APIError(results.errors));
  }

  if (!results.data.trip?.tripPatterns) {
    Boom.resourceGone('Trip not found or is no longer available.');
  }

  const singleTripPattern = results.data.trip?.tripPatterns.find( trip => {
    const journeyIds = extractServiceJourneyIds(trip)
    if (journeyIds.length != query.journeyIds.length) return false; // Fast comparison
    return (JSON.stringify(journeyIds) === JSON.stringify(query.journeyIds.length)) // Slow comparison
  })

  if (singleTripPattern) {
    return Result.ok(singleTripPattern);
  } else {
    return Result.err(new Error('Trip not found or is no longer available.'))
  }
}

function mapTripsData(input: TripsQuery): TripsQuery {
  console.log(input);
  input.trip?.tripPatterns.forEach(pattern => {
    (pattern as any).id = Math.floor(Math.random() * 1000000).toString(24);
  });

  return input;
}
