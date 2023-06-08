import Hapi from '@hapi/hapi';
import {getQuaysCoordinatesRequest} from './schema';
import {QuaysCoordinatesPayload} from '../../service/types';
import {IQuayService} from '../../service/interface';

export default (server: Hapi.Server) => (service: IQuayService) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/quays-coordinates',
    options: {
      tags: ['api', 'quays', 'coordinates'],
      validate: getQuaysCoordinatesRequest,
      description: 'Get quays coordinates',
    },
    handler: async (request, h) => {
      const payload = request.payload as unknown as QuaysCoordinatesPayload;

      return (await service.getQuaysCoordinates(payload, h.request)).unwrap();
    },
  });
};
