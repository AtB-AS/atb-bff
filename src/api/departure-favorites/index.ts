import Hapi from '@hapi/hapi';
import { IDepartureFavoritesService } from '../../service/interface';
import { getDepartureFavoritesCursoredRequest } from './schema';
import {
  DepartureFavoritesPayload,
  DepartureFavoritesQuery
} from '../../service/types';
export default (server: Hapi.Server) => (
  service: IDepartureFavoritesService
) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/departure-favorites',
    options: {
      tags: ['api', 'stops', 'departures'],
      validate: getDepartureFavoritesCursoredRequest,
      description: 'Get departures grouped on lines from feature location'
    },
    handler: async (request, h) => {
      const location = (request.payload as unknown) as DepartureFavoritesPayload;
      const query = (request.query as unknown) as DepartureFavoritesQuery;

      return (await service.getDeparturesFavorites(location, query)).unwrap();
    }
  });
};
