import { badRequest } from '@hapi/boom';
import Hapi from '@hapi/hapi';
import gql from 'graphql-tag';
import WebSocket from 'ws';
import { vehiclesSubscriptionClient } from '../../graphql/graphql-client';
import { IVehiclesService } from '../../service/interface';
import { ServiceJourneyVehicleQueryVariables } from '../../service/types';
import { getVehiclesRequest } from './schema';

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
      plugins: {
        websocket: {
          only: true,
          initially: true,
          connect: ({ ctx, ws }) => {
            const client = vehiclesSubscriptionClient
              .subscribe({
                query: VEHICLE_UPDATES_SUBSCRIPTION,
                fetchPolicy: 'no-cache',
                variables: {
                  serviceJourneyId: 'ATB:ServiceJourney:3_230227084808512_72',
                  includePointsOnLink: false
                }
              })
              .subscribe({
                next: value => ws.send(JSON.stringify(value.data)),
                complete: console.log,
                error: console.error,
                start: console.log
              });

            ctx.client = client;
          },
          disconnect: ({ ctx }) => {
            if (ctx.client !== null && ctx.client !== undefined) {
              ctx.client.unsubscribe();
              ctx.client = null;
            }
          }
        }
      }
    },
    handler: request => {
      let { initially, ws } = request.websocket();
      if (initially) {
        ws.send('HELLO');
        return '';
      }
      return '';
    }
  });

  server.route({
    method: 'POST',
    path: '/bff/ws-test',
    options: {
      plugins: {
        websocket: {
          only: true,
          initially: true,
          connect: ({ ctx, ws }) => {
            ctx.to = setInterval(() => {
              console.log('sss');
              if (ws.readyState === WebSocket.OPEN)
                ws.send(JSON.stringify({ cmd: 'PING' }));
            }, 5000);
          },
          disconnect: ({ ctx }) => {
            if (ctx.to !== null && ctx.to !== undefined) {
              clearTimeout(ctx.to);
              ctx.to = null;
            }
          }
        }
      }
    },
    handler: (request, h) => {
      let { initially, ws } = request.websocket();
      if (initially) {
        ws.send(
          JSON.stringify({
            cmd: 'HELLO'
          })
        );
        return '';
      }
      if (typeof request.payload !== 'object' || request.payload === null)
        return badRequest('invalid request');
      const p = request.payload as any;
      if (typeof p.cmd !== 'string') return badRequest('invalid request');
      if (p.cmd === 'PING') return { result: 'PONG' };
      return badRequest('unknown command');
    }
  });
};

export const VEHICLE_FRAGMENT = gql`
  fragment VehicleFragment on VehicleUpdate {
    serviceJourney {
      id
    }
    mode
    lastUpdated
    lastUpdatedEpochSecond
    monitored
    bearing
    location {
      latitude
      longitude
    }
  }
`;
export const VEHICLE_UPDATES_SUBSCRIPTION = gql`
  subscription VehicleUpdates($serviceJourneyId: String, $monitored: Boolean) {
    vehicleUpdates(serviceJourneyId: $serviceJourneyId, monitored: $monitored) {
      ...VehicleFragment
    }
  }
  ${VEHICLE_FRAGMENT}
`;
