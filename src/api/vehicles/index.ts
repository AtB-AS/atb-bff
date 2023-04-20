import Hapi from '@hapi/hapi';
import { IVehiclesService } from '../../service/interface';
import { ServiceJourneyVehicleQueryVariables } from '../../service/types';
import { getUrlParam } from '../../utils/getUrlParam';
import { getVehiclesRequest, getVehicleSubscriptionRequest } from './schema';

export default (server: Hapi.Server) => (service: IVehiclesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/vehicles/service-journeys',
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
  server.route({
    method: 'POST',
    path: '/bff/v2/vehicles/service-journey/subscription',
    options: {
      tags: ['api', 'websocket', 'vehicle', 'coordinates'],
      validate: getVehicleSubscriptionRequest,
      description: 'Get vehicle information for a list of service journeys',
      plugins: {
        websocket: {
          only: true,
          connect: ({ ctx, ws, req }) => {
            if (!req.url) return;
            const id = getUrlParam(req.url, 'serviceJourneyId');
            if (!id) return;
            ctx.client = service.createServiceJourneyVehicleSubscription(
              { serviceJourneyId: id },
              ws
            );
          },
          disconnect: ({ ctx }) => {
            if (ctx.client) {
              ctx.client.unsubscribe();
              ctx.client = null;
            }
          }
        }
      }
    },
    handler: () => ''
  });
};
