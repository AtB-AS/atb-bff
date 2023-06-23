import Hapi from '@hapi/hapi';
import {IStopPlacesService} from '../../service/interface';
import {getHarborsRequest, getStopPlacesRequest} from './schema';
import {DestinationHarborsQuery, HarborsQuery} from '../../service/types';

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
  server.route({
    method: 'GET',
    path: '/bff/v1/stop-place',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlacesRequest,
      description: 'Get stop places',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as DestinationHarborsQuery;
      console.log(query);
      return (await service.getStopPlace(query, h.request)).unwrap();
    },
  });
};
