import {ITrips_v2} from '../../interface';
import {BookingTraveller, TripsQueryWithJourneyIds} from '../../../types/trips';
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
import {toMidnight} from './utils';
import {SALES_BASEURL} from '../../../config/env';
import {TripPatternFragment} from '../fragments/journey-gql/trips.graphql-gen';
import {post} from '../../../utils/fetch-client';

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
      console.log('start of day', toMidnight(query.searchTime));
      const tripsQueryVariables: TripsQueryVariables = {
        from: {place: query.fromStopPlaceId},
        to: {place: query.toStopPlaceId},
        arriveBy: false,
        when: toMidnight(query.searchTime),
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

      // [
      //   {
      //     ...trips,
      //     available: AvailablityType.Available,
      //     numberOfAvailableSeats: 12,
      //     price: 0,
      //   },
      // ];

      console.log(result.trip.tripPatterns.length);

      const tripsWithAvailability = await Promise.all(
        result.trip?.tripPatterns.map(async (trip) => {
          const availability = await getSalesAvailability(
            trip,
            payload.travellers,
            payload.products,
            headers,
          );
          return {
            ...trip,
            available: BookingAvailabilityType.Available,
            // numberOfAvailableSeats: 12,
            // price: 0,
          };
        }),
      );
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

const getSalesAvailability = async (
  trip: TripPatternFragment,
  travellers: BookingTraveller[],
  products: string[],
  headers: Request<ReqRefDefaults>,
): Promise<BookingAvailabilityType> => {
  // const requestBody = {
  //   travellers,
  //   travelDate: travel_date.toISOString(),
  //   products,
  //   legs: legs.map((leg) => ({
  //     fromStopPlaceId: leg.fromStopPlaceId,
  //     toStopPlaceId: leg.toStopPlaceId,
  //     serviceJourneyId: leg.serviceJourneyId,
  //     mode: leg.mode,
  //     travelDate: leg.expectedStartTime.split('T')[0],
  //   })),
  //   isOnBehalfOf: false,
  // };

  console.log('searching for offer', headers.headers);
  try {
    console.log('sending request');
    const response = await post(
      `/sales/v1/search/trip-pattern`,
      {
        travellers,
        travelDate: trip.expectedStartTime,
        products,
        legs: trip.legs.map((leg) => ({
          fromStopPlaceId: leg.fromPlace.quay?.stopPlace?.id,
          toStopPlaceId: leg.toPlace.quay?.stopPlace?.id,
          serviceJourneyId: leg.serviceJourney?.id,
          mode: leg.mode,
          travelDate: leg.expectedStartTime.split('T')[0],
        })),
      },
      headers,
      {},
      SALES_BASEURL,
    );
    console.log('got response');
    console.log('text', await response.text());
  } catch (error) {
    console.log('GOT ERROR', error);
  }
  return BookingAvailabilityType.Available;

  // 1. Offer 👍 - Available: 12 seats or null
  // 2. 404 Error - Sold out
  // 3. Empty array - Ticket sales closed
};
