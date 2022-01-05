import Hapi from "@hapi/hapi";
import {ITrips_v3} from "../../service/interface";
import {CompressedSingleTripQuery, TripsQueryVariables, TripsQueryWithJourneyIds} from "../../types/trips";
import {postEncodedSingleTripRequest, postSingleTripRequest, postTripsRequest} from './schema';
import {parseTripQueryString} from "../../utils/journey-utils";
import {getMapLegsRequest} from "../servicejourney/schema";
import {MapLegsQuery} from "../../service/types";

export default (server: Hapi.Server) => (service: ITrips_v3) => {
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
      console.log(unwrapped);
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
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/mapLegs',
    options: {
      tags: ['api', 'maplegs'],
      validate: getMapLegsRequest,
      description: 'Get mapLegs for a service journey'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as MapLegsQuery;
      return server.methods.getServiceJourneyMapInfo(query);
    }
  });
};

