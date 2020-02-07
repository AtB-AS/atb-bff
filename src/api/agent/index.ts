import Hapi from '@hapi/hapi';

import { IAgentService } from '../../service/interface';
import {
  getNextDepartureBetweenNearestRequest,
  getNextDeparturesRequest
} from './schema';
import {
  NextDepartureFromCoordinateQuery,
  NextDepartureFromStopQuery
} from '../../service/types';

export default (server: Hapi.Server) => (agentService: IAgentService) => {
  server.route({
    method: 'GET',
    path: '/v1/agent/next-departure-between',
    options: {
      tags: ['api', 'agent'],
      validate: getNextDeparturesRequest,
      description: 'Get next departures between stops'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as NextDepartureFromStopQuery;
      const departure = await agentService.getNextDepartureBetweenStops(query);

      return departure.unwrap();
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/agent/next-departure-between-nearest',
    options: {
      tags: ['api', 'agent'],
      validate: getNextDepartureBetweenNearestRequest
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as NextDepartureFromCoordinateQuery;
      const departure = await agentService.getNextDepartureFromCoordinate(
        query
      );

      return departure.unwrap();
    }
  });
};
