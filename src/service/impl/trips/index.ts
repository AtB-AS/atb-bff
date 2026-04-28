import {ITrips_v2} from '../../interface';
import {
  TripPatternWithBooking,
  TripPattern,
  TripsQueryWithJourneyIds,
  RefreshedLeg,
  Leg,
} from '../../../types/trips';
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
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {
  StreetMode,
  TransportMode,
  TransportSubmode,
  Mode,
} from '../../../graphql/journey/journeyplanner-types_v3';
import {Result} from '@badrap/result';
import * as Boom from '@hapi/boom';
import {APIError} from '../../../utils/api-error';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {getBookingInfo} from './booking-utils';
import {TripPatternFragment} from '../fragments/journey-gql/trips.graphql-gen';
import {
  extractServiceJourneyIds,
  generateSingleTripQueryString,
  computeAimedTimes,
  determineTripStatus,
} from './utils';

export default (): ITrips_v2 => {
  const api: ITrips_v2 = {
    async getTrips(query, request: Request<ReqRefDefaults>) {
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
    },

    async getNonTransitTrips(query, request) {
      const gqlQueryVariables: TripsNonTransitQueryVariables = {
        ...query,
        includeFoot: query.directModes.includes(StreetMode.Foot),
        includeBicycle: query.directModes.includes(StreetMode.Bicycle),
        includeBikeRental: query.directModes.includes(StreetMode.BikeRental),
      };

      try {
        const result = await journeyPlannerClient(request).query<
          TripsNonTransitQuery,
          TripsNonTransitQueryVariables
        >({
          query: TripsNonTransitDocument,
          variables: gqlQueryVariables,
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        // Due to an Entur bug (?) trip suggestions for rental bike sometimes contain only foot legs.
        // This typically happens for short journeys in areas without rental bikes.
        if (bikeRentalContainsOnlyFootLegs(result.data)) {
          result.data = {...result.data, bikeRentalTrip: {tripPatterns: []}};
        }

        const tripPatterns = Object.values(result.data).flatMap(
          (trip) => trip.tripPatterns,
        );
        return Result.ok(tripPatterns);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },

    async getBookingTrips(query, payload, request) {
      const tripsQueryVariables: TripsQueryVariables = {
        from: {place: query.fromStopPlaceId},
        to: {place: query.toStopPlaceId},
        arriveBy: false,
        when: query.searchTime,
        searchWindow: 1440, // 24 hours
        includeCancellations: false,
        modes: {
          transportModes: [
            {
              transportMode: TransportMode.Water,
              transportSubModes: [TransportSubmode.HighSpeedPassengerService],
            },
          ],
        },
      };

      const result = (
        await api.getTrips(tripsQueryVariables, request)
      ).unwrap();

      const tripPatternsWithBookingInfo: TripPatternWithBooking[] =
        await Promise.all(
          result.trip?.tripPatterns.map(async (tripPattern) => {
            const booking = await getBookingInfo(
              request,
              tripPattern,
              payload.travellers,
              payload.products,
              payload.supplementProducts ?? [],
            );
            return {
              ...tripPattern,
              booking,
            };
          }),
        );
      const resultWithBookingInfo = {
        ...result,
        trip: {
          ...result.trip,
          tripPatterns: tripPatternsWithBookingInfo,
        },
      };

      return Result.ok(resultWithBookingInfo);
    },

    async getSingleTrip(
      queryWithIds: TripsQueryWithJourneyIds,
      request: Request<ReqRefDefaults>,
    ) {
      const results = await journeyPlannerClient(request).query<
        TripsQuery,
        TripsQueryVariables
      >({
        query: TripsDocument,
        variables: queryWithIds.query,
      });

      if (results.errors) {
        return Result.err(
          Boom.internal('Error fetching data', results.errors),
        );
      }

      const singleTripPattern = results.data.trip?.tripPatterns.find((trip) => {
        const journeyIds = extractServiceJourneyIds(trip);
        if (journeyIds.length != queryWithIds.journeyIds.length) return false;
        return (
          JSON.stringify(journeyIds) ===
          JSON.stringify(queryWithIds.journeyIds)
        );
      });

      if (singleTripPattern) {
        return Result.ok({
          ...singleTripPattern,
          compressedQuery: generateSingleTripQueryString(
            singleTripPattern,
            queryWithIds.query,
          ),
        });
      } else {
        return Result.err(
          Boom.resourceGone(
            'Trip not found or is no longer available. (No matching trips)',
          ),
        );
      }
    },

    async refreshSingleTrip(
      tripPattern: TripPattern,
      request: Request<ReqRefDefaults>,
    ) {
      const client = journeyPlannerClient(request);

      // Refetch all transit legs in parallel, keep non-transit legs as-is
      const refreshedLegs: RefreshedLeg[] = await Promise.all(
        tripPattern.legs.map(async (leg): Promise<RefreshedLeg> => {
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
              return result.data.leg as Leg;
            }
          } catch {
            // Query failed — treat as stale
          }

          return {id: leg.id, status: 'stale' as const};
        }),
      );

      // Merge stale legs with originals for best-effort time computation.
      // Mark stale legs so determineTripStatus can detect them.
      const mergedLegs: Leg[] = refreshedLegs.map((leg, index) => {
        if ('status' in leg && leg.status === 'stale') {
          return {...tripPattern.legs[index], isStale: true};
        }
        return leg as Leg;
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
    },
  };

  return api;
};

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
