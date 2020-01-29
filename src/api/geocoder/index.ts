import Hapi from '@hapi/hapi';

import { IGeocoderService } from '../../service/interface';
import { getFeaturesRequest, getFeaturesReverseRequest } from './schema';
import { FeaturesQuery, ReverseFeaturesQuery } from '../../service/types';

export default (server: Hapi.Server) => (service: IGeocoderService) => {
  server.route({
    method: 'GET',
    path: '/v1/geocoder/features',
    options: {
      description: 'Find features matching query',
      tags: ['api', 'geocoder'],
      validate: getFeaturesRequest
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as FeaturesQuery;
      return (await service.getFeatures(query)).unwrap();
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/geocoder/reverse',
    options: {
      description:
        'Find addresses, POIs and stop places near the given coordinates',
      tags: ['api', 'geocoder'],
      validate: getFeaturesReverseRequest
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as ReverseFeaturesQuery;
      return await (await service.getFeaturesReverse(query)).unwrap();
    }
  });
};
