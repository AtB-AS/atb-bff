import Hapi from '@hapi/hapi';
import {IRealtimeService} from '../../service/interface';
import {DepartureRealtimeQuery} from '../../service/types';
import {getDepartureRealtime} from './schema';

export default (server: Hapi.Server) => (service: IRealtimeService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/realtime',
    options: {
      tags: ['api', 'quays', 'departures', 'realtime'],
      validate: getDepartureRealtime,
      description: 'Get updated realtime information for the given quays',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as DepartureRealtimeQuery;
      return (await service.getDepartureRealtime(query, h.request)).unwrap();
    },
  });
};
