import Hapi from '@hapi/hapi';
import { IStopsService } from '../../service/interface';
import {
  DepartureGroupsPayload,
  DepartureGroupsQuery,
  DepartureRealtimeQuery,
  DepartureFavoritesPayload,
  DepartureFavoritesQuery
} from '../../service/types';
import {
  getDepartureRealtime,
  getDeparturesCursoredRequest,
  getDepartureFavoritesCursoredRequest
} from './schema';

export default (server: Hapi.Server) => (service: IStopsService) => {
  server.route({
    method: 'POST',
    path: '/bff/v1/departures-grouped',
    options: {
      tags: ['api', 'stops', 'departures'],
      validate: getDeparturesCursoredRequest,
      description: 'Get departures grouped on lines from feature location'
    },
    handler: async (request, h) => {
      const location = request.payload as unknown as DepartureGroupsPayload;
      const query = request.query as unknown as DepartureGroupsQuery;
      return (await service.getDeparturesGrouped(location, query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/departure-favorites',
    options: {
      tags: ['api', 'stops', 'departures'],
      validate: getDepartureFavoritesCursoredRequest,
      description: 'Get departures grouped on lines from feature location'
    },
    handler: async (request, h) => {
      const location = request.payload as unknown as DepartureFavoritesPayload;
      const query = request.query as unknown as DepartureFavoritesQuery;

      return (await service.getDeparturesFavorites(location, query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/departures-realtime',
    options: {
      tags: ['api', 'stops', 'departures', 'realtime'],
      validate: getDepartureRealtime,
      description:
        'Get updated realtime information of all lines and quays passed as data'
    },
    handler: async (request, h) => {
      const query = request.query as unknown as DepartureRealtimeQuery;
      return (await service.getDepartureRealtime(query)).unwrap();
    }
  });
};
