import Hapi from "@hapi/hapi";
import {IStopsService, ITrips_v3} from "../../service/interface";
import { getTripsRequest} from "./schema";
import {Boom} from "@hapi/boom";
import {DeparturesFromQuayQuery, QuaysForStopPlaceQuery, TripQuery, TripQuery_v3} from "../../service/types";

export default (server: Hapi.Server) => (service: ITrips_v3) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/trips',
    options: {
      tags: ['api', 'trips'],
      description: 'Get trips from and to',
      validate: getTripsRequest
    },

    handler: async (request, h) => {
      const query = (request.query as unknown) as TripQuery_v3;
      const result = await service.getTrips(query);
      console.log(result);
      return result.unwrap();
    }
  });
}



