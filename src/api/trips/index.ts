import Hapi from '@hapi/hapi';
import { ITrips_v2 } from '../../service/interface';
import { TripPatternsQuery } from '../../service/types';
import {
  CompressedSingleTripQuery,
  TripsQueryWithJourneyIds
} from '../../types/trips';
import { parseTripQueryString } from '../../service/impl/trips/utils';
import {
  postEncodedSingleTripRequest,
  postSingleTripRequest,
  postTripsRequest,
  postJourneyRequest
} from './schema';
import { TripsQueryVariables } from '../../service/impl/trips/journey-gql/trip.graphql-gen';

export default (server: Hapi.Server) => (service: ITrips_v2) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/trips',
    options: {
      tags: ['api', 'trips'],
      description: 'Get trips between stops',
      validate: postTripsRequest
    },

    handler: async (request, h) => {
      const query = request.payload as unknown as TripsQueryVariables;
      const result = await service.getTrips(query, h.request);
      const unwrapped = result.unwrap();
      return unwrapped;
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/singleTrip',
    options: {
      tags: ['api', 'singleTrip'],
      description: 'Get a single trip',
      validate: postEncodedSingleTripRequest
    },
    handler: async (request, h) => {
      const queryString = request.payload as CompressedSingleTripQuery;
      const query: TripsQueryWithJourneyIds = parseTripQueryString(
        queryString.compressedQuery,
        postSingleTripRequest.payload
      );
      const result = await service.getSingleTrip(query, h.request);
      return result.unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v1/journey/trip',
    options: {
      description: 'Find trip patterns',
      tags: ['api', 'journey'],
      validate: postJourneyRequest,
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = request.payload as unknown as TripPatternsQuery;
      return (await service.getTripPatterns(query, h.request)).unwrap();
    }
  });
};
