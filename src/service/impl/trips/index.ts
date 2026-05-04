import {ITrips_v2} from '../../interface';
import {
  TripPatternWithBooking,
  TripPattern,
  TripsQueryWithJourneyIds,
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
import {
  extractServiceJourneyIds,
  generateSingleTripQueryString,
  computeTripAimedStartEnd,
  adjustNonTransitExpectedTimes,
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
        return Result.err(Boom.internal('Error fetching data', results.errors));
      }

      const singleTripPattern = results.data.trip?.tripPatterns.find((trip) => {
        const journeyIds = extractServiceJourneyIds(trip);
        if (journeyIds.length != queryWithIds.journeyIds.length) return false;
        return (
          JSON.stringify(journeyIds) === JSON.stringify(queryWithIds.journeyIds)
        );
      });

      request.logfmt.with({
        singleTrip_version: 'v2',
        singleTrip_found: singleTripPattern ? 'true' : 'false',
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

      const now = new Date().toISOString();

      let transitLegs = 0;
      let refreshed = 0;
      let refreshFailed = 0;

      // Refetch all transit legs in parallel, keep non-transit legs as-is.
      // Failed fetches fall back to the original leg with its old refreshedAt.
      const legs: Leg[] = await Promise.all(
        tripPattern.legs.map(async (leg): Promise<Leg> => {
          if (!leg.id) {
            return {...leg, refreshedAt: now};
          }

          transitLegs++;

          try {
            const result = await client.query<
              RefreshLegQuery,
              RefreshLegQueryVariables
            >({
              query: RefreshLegDocument,
              variables: {id: leg.id},
            });

            if (result.data.leg) {
              refreshed++;
              return {...(result.data.leg as Leg), refreshedAt: now};
            }
          } catch {
            // Query failed — leg keeps its old refreshedAt
          }

          refreshFailed++;
          return leg;
        }),
      );

      const adjustedLegs = adjustNonTransitExpectedTimes(legs);

      const status = determineTripStatus(adjustedLegs);
      const {aimedStartTime, aimedEndTime} =
        computeTripAimedStartEnd(adjustedLegs);

      request.logfmt.with({
        singleTrip_version: 'v3',
        singleTrip_status: status,
        singleTrip_totalLegs: tripPattern.legs.length.toString(),
        singleTrip_transitLegs: transitLegs.toString(),
        singleTrip_refreshed: refreshed.toString(),
        singleTrip_refreshFailed: refreshFailed.toString(),
      });

      const expectedStartTime = adjustedLegs[0].expectedStartTime;
      const expectedEndTime =
        adjustedLegs[adjustedLegs.length - 1].expectedEndTime;

      const duration = adjustedLegs.reduce((acc, leg) => acc + leg.duration, 0);
      const walkDistance = adjustedLegs
        .filter((leg) => leg.mode === Mode.Foot)
        .reduce((acc, leg) => acc + leg.distance, 0);

      return Result.ok({
        ...tripPattern,
        status,
        aimedStartTime,
        aimedEndTime,
        expectedStartTime,
        expectedEndTime,
        duration,
        walkDistance,
        legs: adjustedLegs,
      });
    },
  };

  return api;
};

function mapTripsData(
  results: TripsQuery,
  queryVariables: TripsQueryVariables,
): TripsQuery {
  const now = new Date().toISOString();
  return {
    ...results,
    trip: {
      ...results.trip,
      tripPatterns: results.trip.tripPatterns.map((pattern) => ({
        ...pattern,
        compressedQuery: generateSingleTripQueryString(pattern, queryVariables),
        legs: pattern.legs.map((leg) => ({...leg, refreshedAt: now})),
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
