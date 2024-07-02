import Hapi from '@hapi/hapi';
import {IStopPlacesService} from '../../service/interface';
import {
  getStopPlaceConnectionsRequest,
  getStopPlaceParentRequest,
  getStopPlacesByModeRequest,
} from './schema';
import {
  StopPlaceConnectionsQuery,
  StopPlaceParentQuery,
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
  server.route({
    method: 'GET',
    path: '/bff/v2/stop-places/parent',
    options: {
      tags: ['api', 'stop', 'parent'],
      validate: getStopPlaceParentRequest,
      description:
        'Get stop place parent ID from a stop place ID, if the stop place ID is a parent, return itself',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopPlaceParentQuery;
      return (await service.getStopPlaceParent(query, h.request)).unwrap();
    },
  });
};
