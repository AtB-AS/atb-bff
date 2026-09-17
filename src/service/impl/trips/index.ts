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
import {withTransferRisk, getTripTransferRisk} from '@atb-as/utils';
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
        variables: {
          ...queryWithIds.query,
          transferSlack: 0,
        },
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
      const failedLegIds: string[] = [];

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
              // Preserve interchangeTo/interchangeFrom from the original leg:
              // they're trip-level relationships that journey-planner does not
              // populate when a leg is queried in isolation by id.
              return {
                ...(result.data.leg as Leg),
                interchangeTo: leg.interchangeTo,
                interchangeFrom: leg.interchangeFrom,
                refreshedAt: now,
              };
            }
          } catch {
            // Query failed — leg keeps its old refreshedAt
          }

          failedLegIds.push(leg.id);
          return leg;
        }),
      );

      const adjustedLegs = withTransferRisk(
        adjustNonTransitExpectedTimes(legs),
      );

      const status = determineTripStatus(adjustedLegs);
      const transferRisk = getTripTransferRisk(adjustedLegs);
      const {aimedStartTime, aimedEndTime} =
        computeTripAimedStartEnd(adjustedLegs);

      // The pattern the client posts back carries the compressedQuery we set on
      // the original /bff/v2/trips response, which encodes the search that
      // produced this trip. It is the only link back to that search: requestId
      // is per-request, so it cannot join the two log lines.
      const compressedQuery = (tripPattern as {compressedQuery?: string})
        .compressedQuery;

      // Until 'impossible' status is removed, we use status === 'stale',
      // because 'impossible' means the data is not stale.
      // Otherwise we should use status !== 'valid' in the future.
      const degraded = failedLegIds.length > 0 || status === 'stale';

      // Skip successful logs
      if (!degraded) {
        request.logfmt.suppress();
      }

      request.logfmt.with({
        singleTrip_version: 'v3',
        singleTrip_status: status,
        singleTrip_transferRisk: transferRisk ?? 'none',
        singleTrip_modes: adjustedLegs.map((leg) => leg.mode).join(','),
        singleTrip_serviceJourneyIds:
          extractServiceJourneyIds(tripPattern).join(',') || 'none',
        singleTrip_totalLegs: tripPattern.legs.length.toString(),
        singleTrip_transitLegs: transitLegs.toString(),
        singleTrip_refreshed: refreshed.toString(),
        singleTrip_refreshFailed: failedLegIds.length.toString(),
        ...(failedLegIds.length > 0 && {
          singleTrip_failedLegIds: failedLegIds.join(','),
        }),
        // Replay key for the original search. Every line written here is a
        // degraded or errored refresh, so this never reaches the happy path.
        ...(compressedQuery && {
          singleTrip_compressedQuery: compressedQuery,
        }),
      });

      const expectedStartTime = adjustedLegs[0].expectedStartTime;
      const expectedEndTime =
        adjustedLegs[adjustedLegs.length - 1].expectedEndTime;

      const duration =
        (new Date(expectedEndTime).getTime() -
          new Date(expectedStartTime).getTime()) /
        1000;
      const walkDistance = adjustedLegs
        .filter((leg) => leg.mode === Mode.Foot)
        .reduce((acc, leg) => acc + leg.distance, 0);

      return Result.ok({
        // After the spread: clients POST the whole pattern back, so a value
        // echoed from an earlier response must be overwritten, not kept.
        ...tripPattern,
        status,
        transferRisk,
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
      tripPatterns: results.trip.tripPatterns.map((pattern) => {
        const legs = pattern.legs.map((leg) => ({
          ...leg,
          refreshedAt: now,
        }));
        const {aimedStartTime, aimedEndTime} = computeTripAimedStartEnd(legs);
        return {
          ...pattern,
          aimedStartTime,
          aimedEndTime,
          compressedQuery: generateSingleTripQueryString(
            pattern,
            queryVariables,
          ),
          legs,
        };
      }),
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
