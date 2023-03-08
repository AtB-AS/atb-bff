import Hapi from '@hapi/hapi';
import { IVehiclesService } from '../../service/interface';
import { VehiclesQuery } from '../../service/types';
import { getScootersRequest } from './schema';

export default (server: Hapi.Server) => (service: IVehiclesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/vehicles',
    options: {
      tags: ['api', 'vehicle', 'scooter', 'bike', 'coordinates'],
      validate: getScootersRequest,
      description: 'Get vehicles (scooters, bikes etc.) within an area'
    },
    handler: async (request) => {
      const payload = request.query as unknown as VehiclesQuery;

      return (await service.getVehicles(payload)).unwrap();
    }
  });
};
