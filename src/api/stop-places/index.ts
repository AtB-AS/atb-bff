import Hapi from '@hapi/hapi';
import {IStopPlacesService} from '../../service/interface';
import {
  getStopPlaceConnectionsRequest,
  getStopPlacesByModeRequest,
} from './schema';
import {
  StopPlaceConnectionsQuery,
  StopPlacesByModeQuery,
} from '../../service/types';

export default (server: Hapi.Server) => (service: IStopPlacesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/stop-places/mode',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlacesByModeRequest,
      description: 'Get stop places by mode',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopPlacesByModeQuery;
      return (await service.getStopPlacesByMode(query, h.request)).unwrap();
    },
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/stop-places/connections',
    options: {
      tags: ['api', 'stop', 'connections'],
      validate: getStopPlaceConnectionsRequest,
      description: 'Get stop place connections',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopPlaceConnectionsQuery;
      return (await service.getStopPlaceConnections(query, h.request)).unwrap();
    },
  });
};
