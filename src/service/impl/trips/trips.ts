import {
  TripsDocument,
  TripsNonTransitDocument,
  TripsNonTransitQuery,
  TripsNonTransitQueryVariables,
  TripsQuery,
  TripsQueryVariables,
} from './journey-gql/trip.graphql-gen';
import {
  RefreshLegDocument,
  RefreshLegQuery,
  RefreshLegQueryVariables,
} from './journey-gql/leg.graphql-gen';
import {Result} from '@badrap/result';
import {APIError} from '../../../utils/api-error';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {ReqRefDefaults, Request} from '@hapi/hapi';

import * as Boom from '@hapi/boom';
import {
  extractServiceJourneyIds,
  generateSingleTripQueryString,
  computeAimedTimes,
  determineTripStatus,
} from './utils';
import * as Trips from '../../../types/trips';
import {TripPatternFragment} from '../fragments/journey-gql/trips.graphql-gen';
import {Mode} from '../../../graphql/journey/journeyplanner-types_v3';
import {
  DatedServiceJourneyDocument,
  DatedServiceJourneyQuery,
  DatedServiceJourneyQueryVariables,
} from '../service-journey/journey-gql/dated-service-journey.graphql-gen';

export async function getTrips(
  query: TripsQueryVariables,
  request: Request<ReqRefDefaults>,
): Promise<Result<TripsQuery, APIError>> {
  try {
    const result = await journeyPlannerClient(request).query<
      TripsQuery,
      TripsQueryVariables
    >({
      query: TripsDocument,
      variables: query,
    });

    if (result.errors) {
      return Result.err(new APIError(result.errors));
    }
    return Result.ok(mapTripsData(result.data, query));
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

export async function getTripsNonTransit(
  query: TripsNonTransitQueryVariables,
  request: Request<ReqRefDefaults>,
): Promise<Result<TripPatternFragment[], APIError>> {
  try {
    const result = await journeyPlannerClient(request).query<
      TripsNonTransitQuery,
      TripsNonTransitQueryVariables
    >({
      query: TripsNonTransitDocument,
      variables: query,
    });

    if (result.errors) {
      return Result.err(new APIError(result.errors));
    }

    // Due to an Entur bug (?) trip suggestions for rental bike sometimes contain only foot legs.
    // This typically happens for short journeys in areas without rental bikes.
    if (bikeRentalContainsOnlyFootLegs(result.data)) {
      // Remove bike rental suggestion with only foot legs from result.
      result.data = {...result.data, bikeRentalTrip: {tripPatterns: []}};
    }

    const tripPatterns = Object.values(result.data).flatMap(
      (trip) => trip.tripPatterns,
    );
    return Result.ok(tripPatterns);
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

export async function getSingleTrip(
  query: Trips.TripsQueryWithJourneyIds,
  request: Request<ReqRefDefaults>,
): Promise<Result<Trips.TripPattern, Boom.Boom>> {
  const results = await journeyPlannerClient(request).query<
    TripsQuery,
    TripsQueryVariables
  >({
    query: TripsDocument,
    variables: query.query,
  });

  if (results.errors) {
    return Result.err(Boom.internal('Error fetching data', results.errors));
  }

  const singleTripPattern = results.data.trip?.tripPatterns.find((trip) => {
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
        query.query,
      ),
    });
  } else {
    return Result.err(
      Boom.resourceGone(
        'Trip not found or is no longer available. (No matching trips)',
      ),
    );
  }
}

export async function getDatedServiceJourney(
  id: string,
  request: Request<ReqRefDefaults>,
): Promise<Result<DatedServiceJourneyQuery['datedServiceJourney'], APIError>> {
  const result = await journeyPlannerClient(request).query<
    DatedServiceJourneyQuery,
    DatedServiceJourneyQueryVariables
  >({
    query: DatedServiceJourneyDocument,
    variables: {id},
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  return Result.ok(result.data.datedServiceJourney);
}

function mapTripsData(
  results: TripsQuery,
  queryVariables: TripsQueryVariables,
): TripsQuery {
  return {
    ...results,
    trip: {
      ...results.trip,
      tripPatterns: results.trip.tripPatterns.map((pattern) => ({
        ...pattern,
        compressedQuery: generateSingleTripQueryString(pattern, queryVariables),
      })),
    },
  };
}

function bikeRentalContainsOnlyFootLegs(data: TripsNonTransitQuery) {
  return (
    data.bikeRentalTrip &&
    data.bikeRentalTrip.tripPatterns.every((t) =>
      t.legs.every((l) => l.mode === Mode.Foot),
    )
  );
}

export async function refreshSingleTrip(
  tripPattern: Trips.TripPattern,
  request: Request<ReqRefDefaults>,
): Promise<Trips.TripPattern> {
  const client = journeyPlannerClient(request);

  // Refetch all transit legs in parallel, keep non-transit legs as-is
  const refreshedLegs: Trips.RefreshedLeg[] = await Promise.all(
    tripPattern.legs.map(async (leg): Promise<Trips.RefreshedLeg> => {
      if (!leg.id) {
        // Non-transit leg (foot, bicycle, etc.) — return as-is
        return leg;
      }

      try {
        const result = await client.query<
          RefreshLegQuery,
          RefreshLegQueryVariables
        >({
          query: RefreshLegDocument,
          variables: {id: leg.id},
        });

        if (result.data.leg) {
          return result.data.leg as Trips.Leg;
        }
      } catch {
        // Query failed — treat as stale
      }

      return {id: leg.id, status: 'stale' as const};
    }),
  );

  const mergedLegs: Trips.Leg[] = refreshedLegs.map((leg, index) => {
    if ('status' in leg && leg.status === 'stale') {
      return tripPattern.legs[index];
    }
    return leg as Trips.Leg;
  });

  const status = determineTripStatus(mergedLegs);
  const {aimedStartTime, aimedEndTime} = computeAimedTimes(mergedLegs);

  const expectedStartTime = mergedLegs[0].expectedStartTime;
  const expectedEndTime = mergedLegs[mergedLegs.length - 1].expectedEndTime;

  const duration = mergedLegs.reduce((acc, leg) => acc + leg.duration, 0);
  const walkDistance = mergedLegs
    .filter((leg) => leg.mode === Mode.Foot)
    .reduce((acc, leg) => acc + leg.distance, 0);

  return {
    ...tripPattern,
    status,
    aimedStartTime,
    aimedEndTime,
    expectedStartTime,
    expectedEndTime,
    duration,
    walkDistance,
    legs: mergedLegs,
  };
}
