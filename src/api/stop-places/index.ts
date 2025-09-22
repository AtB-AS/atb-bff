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
    path: '/bff/v2/stop-places/distances',
    options: {
      tags: ['api', 'stop', 'distances'],
      validate: getStopPlaceConnectionsRequest,
      description:
        'Get stop place distances. This is a POC endpoint and will change. Should not be relied upon currently',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopPlaceConnectionsQuery;
      return (await service.getStopPlaceDistances(query, h.request)).unwrap();
    },
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/stop-places/parent-id',
    options: {
      tags: ['api', 'stop', 'parent'],
      validate: getStopPlaceParentRequest,
      description:
        'Get the parent ID of a stop place. If it has no parent, the provided stop ID will be returned instead',
      plugins: {
        'hapi-swagger': {
          // Used by app version 1.57 and below.
          deprecated: true,
        },
      },
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopPlaceParentQuery;
      return (await service.getStopPlaceParent(query, h.request)).unwrap();
    },
  });
};
