import {
  TripsDocument,
  TripsQuery,
  TripsQueryVariables
} from './journey-gql/trip.graphql-gen';
import { Result } from '@badrap/result';
import { APIError } from '../../types';
import { journeyPlannerClient } from '../../../graphql/graphql-client';

import * as Boom from '@hapi/boom';
import {
  extractServiceJourneyIds,
  generateSingleTripQueryString
} from './utils';
import * as Trips from '../../../types/trips';

export async function getTrips(
  query: TripsQueryVariables
): Promise<Result<TripsQuery, APIError>> {
  try {
    const result = await journeyPlannerClient.query<
      TripsQuery,
      TripsQueryVariables
    >({ query: TripsDocument, variables: query });

    if (result.errors) {
      return Result.err(new APIError(result.errors));
    }
    return Result.ok(mapTripsData(result.data, query));
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

export async function getSingleTrip(
  query: Trips.TripsQueryWithJourneyIds
): Promise<Result<Trips.TripPattern, Boom.Boom>> {
  const results = await journeyPlannerClient.query<
    TripsQuery,
    TripsQueryVariables
  >({ query: TripsDocument, variables: query.query });

  if (results.errors) {
    return Result.err(Boom.internal('Error fetching data', results.errors));
  }

  const singleTripPattern = results.data.trip?.tripPatterns.find(trip => {
    const journeyIds = extractServiceJourneyIds(trip);
    if (journeyIds.length != query.journeyIds.length) return false; // Fast comparison
    return (
      JSON.stringify(journeyIds) === JSON.stringify(query.journeyIds) // Slow comparison
    );
  });

  if (singleTripPattern) {
    return Result.ok({
      ...singleTripPattern,
      compressedQuery: generateSingleTripQueryString(
        singleTripPattern,
        query.query
      )
    });
  } else {
    return Result.err(
      Boom.resourceGone(
        'Trip not found or is no longer available. (No matching trips)'
      )
    );
  }
}

function mapTripsData(
  results: TripsQuery,
  queryVariables: TripsQueryVariables
): TripsQuery {
  return {
    ...results,
    trip: {
      ...results.trip,
      tripPatterns: results.trip.tripPatterns.map(pattern => ({
        ...pattern,
        compressedQuery: generateSingleTripQueryString(pattern, queryVariables)
      }))
    }
  };
}
