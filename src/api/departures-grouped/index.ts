import Hapi from '@hapi/hapi';
import {IDeparturesGroupedService} from '../../service/interface';
import {
  DepartureGroupsPayload,
  DepartureGroupsQuery,
  DepartureFavoritesPayload,
  DepartureFavoritesQuery,
} from '../../service/types';
import {
  getDeparturesCursoredRequest,
  getDepartureFavoritesCursoredRequest,
} from './schema';

export default (server: Hapi.Server) =>
  (service: IDeparturesGroupedService) => {
    server.route({
      method: 'POST',
      path: '/bff/v1/departures-grouped',
      options: {
        tags: ['api', 'stops', 'departures'],
        validate: getDeparturesCursoredRequest,
        description: 'Get departures grouped on lines from feature location',
      },
      handler: async (request, h) => {
        const location = request.payload as unknown as DepartureGroupsPayload;
        const query = request.query as unknown as DepartureGroupsQuery;
        return (
          await service.getDeparturesGrouped(location, query, h.request)
        ).unwrap();
      },
    });
    server.route({
      method: 'POST',
      path: '/bff/v2/departure-favorites',
      options: {
        tags: ['api', 'stops', 'departures'],
        validate: getDepartureFavoritesCursoredRequest,
        description: 'Get departures grouped on lines from feature location',
      },
      handler: async (request, h) => {
        const location =
          request.payload as unknown as DepartureFavoritesPayload;
        const query = request.query as unknown as DepartureFavoritesQuery;

        return (
          await service.getDeparturesFavorites(location, query, h.request)
        ).unwrap();
      },
    });
  };
