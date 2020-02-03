import Hapi from '@hapi/hapi';
import qs from 'querystring';

import { IGeocoderService } from '../../service/interface';
import { getFeaturesRequest, getFeaturesReverseRequest } from './schema';
import { FeaturesQuery, ReverseFeaturesQuery } from '../../service/types';
import { DEFAULT_CACHE_TTL } from '../../config/cache';

export default (server: Hapi.Server) => (service: IGeocoderService) => {
  const getFeatures = async (q: FeaturesQuery) =>
    (await service.getFeatures(q)).unwrap();
  const getFeaturesReverse = async (q: ReverseFeaturesQuery) =>
    (await service.getFeaturesReverse(q)).unwrap();

  server.method('feature', getFeatures, {
    generateKey: (q: FeaturesQuery) => qs.stringify(q),
    cache: {
      expiresIn: DEFAULT_CACHE_TTL,
      generateTimeout: 5000
    }
  });
  server.method('reverse', getFeaturesReverse, {
    generateKey: (q: ReverseFeaturesQuery) => qs.stringify(q),
    cache: {
      expiresIn: DEFAULT_CACHE_TTL,
      generateTimeout: 5000
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/geocoder/features',
    options: {
      description: 'Find features matching query',
      tags: ['api', 'geocoder'],
      validate: getFeaturesRequest,
      cache: {
        expiresIn: DEFAULT_CACHE_TTL,
        privacy: 'public'
      }
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as FeaturesQuery;
      return server.methods.feature(query);
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/geocoder/reverse',
    options: {
      description:
        'Find addresses, POIs and stop places near the given coordinates',
      tags: ['api', 'geocoder'],
      validate: getFeaturesReverseRequest,
      cache: {
        expiresIn: DEFAULT_CACHE_TTL,
        privacy: 'public'
      }
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as ReverseFeaturesQuery;
      return server.methods.reverse(query);
    }
  });
};
