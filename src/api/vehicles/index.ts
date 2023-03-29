import Hapi from '@hapi/hapi';
import { IVehiclesService } from '../../service/interface';
import { ServiceJourneyVehicleQueryVariables } from '../../service/types';
import { getVehiclesRequest } from './schema';

export default (server: Hapi.Server) => (service: IVehiclesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/vehicles/service-journey',
    options: {
      tags: ['api', 'vehicle', 'coordinates'],
      validate: getVehiclesRequest,
      description: 'Get vehicle information for a list of service journeys'
    },
    handler: async request => {
      const payload =
        request.query as unknown as ServiceJourneyVehicleQueryVariables;

      return (await service.getServiceJourneyVehicles(payload)).unwrap();
    }
  });
};
