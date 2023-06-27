import Hapi from '@hapi/hapi';
import {IStopPlacesService} from '../../service/interface';
import {getStopPlaceConnectionsRequest, getStopPlacesRequest} from './schema';
import {StopPlaceConnectionsQuery, StopPlacesQuery} from '../../service/types';

export default (server: Hapi.Server) => (service: IStopPlacesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v1/stop-places',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlacesRequest,
      description: 'Get stop places',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopPlacesQuery;
      return (await service.getStopPlaces(query, h.request)).unwrap();
    },
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/stop-places/connections',
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
