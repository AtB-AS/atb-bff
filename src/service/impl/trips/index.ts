import {ITrips_v2} from '../../interface';
import {TripsQueryWithJourneyIds} from '../../../types/trips';
import {getSingleTrip, getTrips, getTripsNonTransit} from './trips';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {
  BookingTripsQuery,
  TripsNonTransitQueryVariables,
  TripsQueryVariables,
} from './journey-gql/trip.graphql-gen';
import {
  StreetMode,
  TransportMode,
  TransportSubmode,
} from '../../../graphql/journey/journeyplanner-types_v3';
import {BookingAvailabilityType} from '../../types';
import {Result} from '@badrap/result';

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

    async getBookingTrips(query, headers) {
      const tripsQueryVariables: TripsQueryVariables = {
        from: {place: query.fromStopPlaceId},
        to: {place: query.toStopPlaceId},
        arriveBy: false,
        when: query.searchTime,
        searchWindow: 1440,
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

      // 1. Offer 👍 - Available: 12 plasser eller null
      // 2. Feilmelding - Sold out (404)
      // 3. Tom array - Billettkjøp stengt

      // [
      //   {
      //     ...trips,
      //     available: AvailablityType.Available,
      //     numberOfAvailableSeats: 12,
      //     price: 0,
      //   },
      // ];

      const tripsWithAvailability = result.trip?.tripPatterns.map((trip) => {
        return {
          ...trip,
          available: BookingAvailabilityType.Available,
          // numberOfAvailableSeats: 12,
          // price: 0,
        };
      });
      const mappedResult: BookingTripsQuery = {
        ...result,
        trip: {
          ...result.trip,
          tripPatterns: tripsWithAvailability,
        },
      };

      return Result.ok(mappedResult);
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
