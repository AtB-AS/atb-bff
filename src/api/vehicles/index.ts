import Hapi from '@hapi/hapi';
import {IVehiclesService} from '../../service/interface';
import {ServiceJourneyVehicleQueryVariables} from '../../service/types';
import {getUrlParam} from '../../utils/get-url-param';
import WebSocket from 'ws';
import {
  getVehiclesRequest,
  postServiceJourneySubscriptionRequest,
} from './schema';

export default (server: Hapi.Server) => (service: IVehiclesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/vehicles/service-journeys',
    options: {
      tags: ['api', 'vehicle', 'coordinates'],
      validate: getVehiclesRequest,
      description: 'Get vehicle information for a list of service journeys',
    },
    handler: async (request, h) => {
      const payload =
        request.query as unknown as ServiceJourneyVehicleQueryVariables;

      return (
        await service.getServiceJourneyVehicles(payload, h.request)
      ).unwrap();
    },
  });
  server.route({
    method: 'POST',
    path: '/ws/v2/vehicles/service-journey/subscription',
    options: {
      tags: ['api', 'websocket', 'vehicle', 'coordinates'],
      validate: postServiceJourneySubscriptionRequest,
      description:
        'Subscription for vehicle updates for a single service journey',
      plugins: {
        websocket: {
          only: true,
          connect: ({ctx, ws, req}) => {
            if (!req.url) {
              if (ws.readyState == WebSocket.OPEN) {
                ws.close(1011);
              }
              return;
            }

            const serviceJourneyId = getUrlParam(req.url, 'serviceJourneyId');
            if (!serviceJourneyId) {
              if (ws.readyState == WebSocket.OPEN) {
                ws.close(1002, 'Missing parameter `serviceJourneyId`');
              }
              return;
            }

            try {
              ctx.client = service.createServiceJourneySubscription(
                {serviceJourneyId},
                ws,
              );
            } catch (error) {
              console.error(`WebSocket error: ${error}`);
              if (ws.readyState == WebSocket.OPEN) {
                ws.close(1011, 'Error when creating upstream subscription');
              }
              return;
            }
          },
          disconnect: ({ctx}) => {
            if (ctx.client) {
              ctx.client.unsubscribe();
              ctx.client = null;
            } else {
              console.error('WebSocket error: Failed to unsubscribe');
            }
          },
          error: ({}, error) => {
            console.error(`WebSocket error: ${error}`);
          },
        },
      },
    },
    handler: () => '',
  });
};
