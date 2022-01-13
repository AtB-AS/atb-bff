import Hapi from "@hapi/hapi";
import {ITrips_v2} from "../../service/interface";
import {CompressedSingleTripQuery, TripsQueryVariables, TripsQueryWithJourneyIds} from "../../types/trips";
import {postEncodedSingleTripRequest, postSingleTripRequest, postTripsRequest} from './schema';
import {parseTripQueryString} from "../../utils/journey-utils";

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
      const query = (request.payload as unknown) as TripsQueryVariables;
      const result = await service.getTrips(query);
      const unwrapped = result.unwrap();
      return unwrapped;
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/singleTrip',
    options: {
      tags: ['api', 'singTrip'],
      description: 'Get a single trip',
      validate: postEncodedSingleTripRequest
    },
    handler: async (request, h) => {
      const queryString = request.payload as CompressedSingleTripQuery;
      const query: TripsQueryWithJourneyIds = parseTripQueryString(queryString.compressedQuery, postSingleTripRequest.payload)
      const result = await service.getSingleTrip(query);
      return result.unwrap();
    }
  })
};

