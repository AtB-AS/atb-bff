import Hapi from '@hapi/hapi';
import {IStopPlacesService} from '../../service/interface';
import {getHarborsRequest, getStopPlacesRequest} from './schema';
import {HarborsQuery, StopPlaceQuery} from '../../service/types';

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
      return (await service.getHarbors(query, h.request)).unwrap();
    },
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/harbor/connections',
    options: {
      tags: ['api', 'stop', 'connections'],
      validate: getStopPlacesRequest,
      description: 'Get stop place connections',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopPlaceQuery;
      return (await service.getStopPlace(query, h.request)).unwrap();
    },
  });
};
