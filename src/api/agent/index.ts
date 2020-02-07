import Hapi from '@hapi/hapi';

import { IAgentService } from '../../service/interface';
import { getNextDeparturesRequest } from './schema';
import { NextDepartureFromStopQuery } from '../../service/types';

export default (server: Hapi.Server) => (agentService: IAgentService) => {
  server.route({
    method: 'GET',
    path: '/v1/agent/next-departure',
    options: {
      tags: ['api', 'agent'],
      validate: getNextDeparturesRequest,
      description: 'Get next departures from stop'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as NextDepartureFromStopQuery;
      const departure = await agentService.getNextDepartureFromStop(query);

      return departure.unwrap();
    }
  });
};
