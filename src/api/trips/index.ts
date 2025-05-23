import Hapi from '@hapi/hapi';
import {ITrips_v2} from '../../service/interface';
import {
  BookingTripsQueryParameters,
  BookingTripsQueryPayload,
  CompressedSingleTripQuery,
  NonTransitTripsQueryVariables,
  TripsQueryWithJourneyIds,
} from '../../types/trips';
import {parseTripQueryString} from '../../service/impl/trips/utils';
import {
  postEncodedSingleTripRequest,
  postTripsRequest,
  postNonTransitTripsRequest,
  postBookingTripsRequest,
} from './schema';
import {TripsQueryVariables} from '../../service/impl/trips/journey-gql/trip.graphql-gen';

export default (server: Hapi.Server) => (service: ITrips_v2) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/trips',
    options: {
      tags: ['api', 'trips'],
      description: 'Get trips between stops',
      validate: postTripsRequest,
    },
    handler: async (request, h) => {
      const query = request.payload as unknown as TripsQueryVariables;
      const result = await service.getTrips(query, h.request);
      const unwrapped = result.unwrap();
      return unwrapped;
    },
  });

  server.route({
    method: 'POST',
    path: '/bff/v2/trips/non-transit',
    options: {
      tags: ['api', 'trips'],
      description: 'Get non-transit trips between stops',
      validate: postNonTransitTripsRequest,
    },
    handler: async (request, h) => {
      const query = request.payload as unknown as NonTransitTripsQueryVariables;
      const result = await service.getNonTransitTrips(query, h.request);
      return result.unwrap();
    },
  });

  server.route({
    method: 'POST',
    path: '/bff/v2/trips/booking',
    options: {
      tags: ['api', 'trips'],
      description: 'Get trips with availability information',
      validate: postBookingTripsRequest,
    },
    handler: async (request, h) => {
      const query = request.query as unknown as BookingTripsQueryParameters;
      const payload = request.payload as unknown as BookingTripsQueryPayload;
      const result = await service.getBookingTrips(query, payload, h.request);
      return result.unwrap();
    },
  });

  server.route({
    method: 'POST',
    path: '/bff/v2/singleTrip',
    options: {
      tags: ['api', 'singleTrip'],
      description: 'Get a single trip',
      validate: postEncodedSingleTripRequest,
    },
    handler: async (request, h) => {
      const queryString = request.payload as CompressedSingleTripQuery;
      const query: TripsQueryWithJourneyIds = parseTripQueryString(
        queryString.compressedQuery,
      );
      const result = await service.getSingleTrip(query, h.request);
      return result.unwrap();
    },
  });
};
