import Hapi from "@hapi/hapi";
import {ITrips_v3} from "../../service/interface";
import {postTripsRequest} from './schema';
import {TripQuery_v3} from "../../service/types";

export default (server: Hapi.Server) => (service: ITrips_v3) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/trips',
    options: {
      tags: ['api', 'trips'],
      description: 'Get trips from and to',
      validate: postTripsRequest
    },

    handler: async (request, h) => {
      const query = (request.payload as unknown) as TripQuery_v3;
      const result = await service.getTrips(query);
      const unwrapped = result.unwrap();
      console.log(unwrapped);
      return unwrapped;
    }
  });
};
