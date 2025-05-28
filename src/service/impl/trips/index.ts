import {ITrips_v2} from '../../interface';
import {
  TripPatternWithBooking,
  TripsQueryWithJourneyIds,
} from '../../../types/trips';
import {getSingleTrip, getTrips, getTripsNonTransit} from './trips';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {
  TripsNonTransitQueryVariables,
  TripsQueryVariables,
} from './journey-gql/trip.graphql-gen';
import {
  StreetMode,
  TransportMode,
  TransportSubmode,
} from '../../../graphql/journey/journeyplanner-types_v3';
import {Result} from '@badrap/result';
import {toMidnight} from './utils';
import {getBookingInfo} from './booking-utils';

export default (): ITrips_v2 => {
  const api: ITrips_v2 = {
    async getTrips(query, headers: Request<ReqRefDefaults>) {
      return getTrips(query, headers);
    },

    async getNonTransitTrips(query, headers) {
      const gqlQueryVariables: TripsNonTransitQueryVariables = {
        ...query,
        includeFoot: query.directModes.includes(StreetMode.Foot),
        includeBicycle: query.directModes.includes(StreetMode.Bicycle),
        includeBikeRental: query.directModes.includes(StreetMode.BikeRental),
      };
      return getTripsNonTransit(gqlQueryVariables, headers);
    },

    async getBookingTrips(query, payload, headers) {
      const tripsQueryVariables: TripsQueryVariables = {
        from: {place: query.fromStopPlaceId},
        to: {place: query.toStopPlaceId},
        arriveBy: false,
        when: toMidnight(query.searchTime),
        searchWindow: 1440, // 24 hours
        modes: {
          transportModes: [
            {
              transportMode: TransportMode.Water,
              transportSubModes: [TransportSubmode.HighSpeedPassengerService],
            },
          ],
        },
      };

      const result = (await getTrips(tripsQueryVariables, headers)).unwrap();

      const tripPatternsWithBookingInfo: TripPatternWithBooking[] =
        await Promise.all(
          result.trip?.tripPatterns.map(async (tripPattern) => {
            const booking = await getBookingInfo(
              tripPattern,
              payload.travellers,
              payload.products,
              headers,
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
      headers: Request<ReqRefDefaults>,
    ) {
      return getSingleTrip(queryWithIds, headers);
    },
  };

  return api;
};
