import Hapi from '@hapi/hapi';
import { IVehiclesService } from '../../service/interface';
import { ServiceJourneyVehiclesQueryVariables } from '../../service/types';
import { getVehiclesRequest } from './schema';

export default (server: Hapi.Server) => (service: IVehiclesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/vehicles/service-journey',
    options: {
      tags: ['api', 'vehicle', 'coordinates'],
      validate: getVehiclesRequest,
      description: 'Get vehicles for realtime'
    },
    handler: async request => {
      const payload =
        request.query as unknown as ServiceJourneyVehiclesQueryVariables;

      return (await service.getVehiclesData(payload)).unwrap();
    }
  });
};
