import { Boom } from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { IStopsService_v3 } from '../../service/interface';
import { StopPlaceQuery } from '../../service/types';
import { getStopPlaceByPositionRequest } from './jp3schema';

export default (server: Hapi.Server) => (service: IStopsService_v3) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/stops/nearest',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceByPositionRequest,
      description: 'Find stops near coordinates',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceQuery;
      return (await service.getStopPlacesByPosition(query)).unwrap();
    }
  });
};
