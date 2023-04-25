import Hapi from '@hapi/hapi';
import { IMobilityService } from '../../service/interface';
import { BikeStationQuery, CarStationQuery, StationsQuery, VehicleQuery, VehiclesQuery } from "../../service/types";
import { getVehiclesRequest, getStationsRequest, getVehicleRequest, getCarStationRequest } from "./schema";

export default (server: Hapi.Server) => (service: IMobilityService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/vehicles',
    options: {
      tags: ['api', 'vehicle', 'scooter', 'bike', 'coordinates'],
      validate: getVehiclesRequest,
      description: 'Get vehicles (scooters, bikes etc.) within an area'
    },
    handler: async request => {
      const payload = request.query as unknown as VehiclesQuery;
      return (await service.getVehicles(payload)).unwrap();
    }
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/vehicle',
    options: {
      tags: ['api', 'vehicle', 'scooter', 'bike', 'coordinates'],
      validate: getVehicleRequest,
      description: 'Gets a single vehicle (scooter, bike etc.) within an area'
    },
    handler: async request => {
      const payload = request.query as unknown as VehicleQuery;
      return (await service.getVehiclesExtended(payload))
        .unwrap()
        .vehicles
        ?.filter(v => v.id === payload.id)
        .at(0);

    }
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/stations',
    options: {
      tags: ['api', 'mobility', 'stations', 'bike', 'car'],
      validate: getStationsRequest,
      description: 'Get stations for bikes, car sharing etc.'
    },
    handler: async request => {
      const payload = request.query as unknown as StationsQuery;

      return (await service.getStations(payload)).unwrap();
    }
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/station/car',
    options: {
      tags: ['api', 'mobility', 'station', 'car'],
      validate: getCarStationRequest,
      description: 'Get details about a single car station'
    },
    handler: async request => {
      const payload = request.query as unknown as CarStationQuery;

      return (await service.getCarStation(payload)).unwrap();
    }
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/station/bike',
    options: {
      tags: ['api', 'mobility', 'station', 'bike'],
      validate: getCarStationRequest,
      description: 'Get details about a single bike station'
    },
    handler: async request => {
      const payload = request.query as unknown as BikeStationQuery;

      return (await service.getBikeStation(payload)).unwrap();
    }
  });
};
