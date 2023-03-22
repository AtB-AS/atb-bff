import Hapi from '@hapi/hapi';
import { IMobilityService } from '../../service/interface';
import { StationsQuery, VehiclesQuery } from '../../service/types';
import { getScootersRequest, getStationsRequest } from './schema';

export default (server: Hapi.Server) => (service: IMobilityService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/vehicles',
    options: {
      tags: ['api', 'vehicle', 'scooter', 'bike', 'coordinates'],
      validate: getScootersRequest,
      description: 'Get vehicles (scooters, bikes etc.) within an area'
    },
    handler: async request => {
      const payload = request.query as unknown as VehiclesQuery;

      return (await service.getVehicles(payload)).unwrap();
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
};
