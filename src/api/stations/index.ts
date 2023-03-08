import Hapi from "@hapi/hapi";
import { IStationsService } from "../../service/interface";
import { StationsQuery } from "../../service/types";
import { getStationsRequest } from "./schema";

export default (server: Hapi.Server) => (service: IStationsService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/stations',
    options: {
      tags: ['api', 'mobility', 'stations', 'bike', 'car'],
      validate: getStationsRequest,
      description: 'Get stations for bikes, car sharing etc.'
    },
    handler: async (request) => {
      const payload = request.query as unknown as StationsQuery;

      return (await service.getStations(payload)).unwrap();
    }
  });
};
