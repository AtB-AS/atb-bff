import Hapi from '@hapi/hapi';
import { IVehiclesService } from '../../service/interface';
import { ServiceJourneyVehicleQueryVariables } from '../../service/types';
import { getUrlParam } from '../../utils/getUrlParam';
import {
  getVehiclesRequest,
  postServiceJourneySubscriptionRequest
} from './schema';

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
    path: '/ws/v2/vehicles/service-journey/subscription',
    options: {
      tags: ['api', 'websocket', 'vehicle', 'coordinates'],
      validate: postServiceJourneySubscriptionRequest,
      description: 'Get vehicle information for a list of service journeys',
      plugins: {
        websocket: {
          only: true,
          connect: ({ ctx, ws, req }) => {
            if (!req.url) {
              ws.close(1011);
              return;
            }

            const serviceJourneyId = getUrlParam(req.url, 'serviceJourneyId');
            if (!serviceJourneyId) {
              ws.close(1002, 'Missing parameter `serviceJourneyId`');
              return;
            }

            ctx.client = service.createServiceJourneySubscription(
              { serviceJourneyId },
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
