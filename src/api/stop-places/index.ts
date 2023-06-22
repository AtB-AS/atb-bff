import Hapi from '@hapi/hapi';
import {IStopPlacesService} from '../../service/interface';
import {getHarborsRequest} from './schema';
import {HarborsQuery} from '../../service/types';

export default (server: Hapi.Server) => (service: IStopPlacesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v1/harbors',
    options: {
      tags: ['api', 'stops'],
      validate: getHarborsRequest,
      description: 'Get stop places',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as HarborsQuery;
      console.log(query);
      return (await service.getHarbors(query, h.request)).unwrap();
    },
  });
};
