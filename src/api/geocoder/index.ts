import Hapi, {ReqRefDefaults, Request} from '@hapi/hapi';
import qs from 'querystring';

import {IGeocoderService} from '../../service/interface';
import {getFeaturesRequest, getFeaturesReverseRequest} from './schema';
import {FeaturesQuery, ReverseFeaturesQuery} from '../../service/types';
import {
  CACHE_TTL_MS_CLIENT,
  CACHE_TTL_MS_SERVER_GEOCODER_FEATURES,
  CACHE_TTL_MS_SERVER_GEOCODER_REVERSE,
} from '../../config/env';
import {CacheFactoryProvider} from '../../utils/CacheFactoryProvider';

export default (server: Hapi.Server) => (service: IGeocoderService) => {
  const getFeatures = async (q: FeaturesQuery, h: Request<ReqRefDefaults>) =>
    (await service.getFeatures(q, h)).unwrap();
  const getFeaturesReverse = async (
    q: ReverseFeaturesQuery,
    h: Request<ReqRefDefaults>,
  ) => (await service.getFeaturesReverse(q, h)).unwrap();

  server.method('feature', getFeatures, {
    generateKey: (q: FeaturesQuery) => qs.stringify(q),
    cache: CacheFactoryProvider.getFactory('server').createCache(
      CACHE_TTL_MS_SERVER_GEOCODER_FEATURES,
    ),
  });
  server.method('reverse', getFeaturesReverse, {
    generateKey: (q: ReverseFeaturesQuery) => qs.stringify(q),
    cache: CacheFactoryProvider.getFactory('server').createCache(
      CACHE_TTL_MS_SERVER_GEOCODER_REVERSE,
    ),
  });

  server.route({
    method: 'GET',
    path: '/bff/v1/geocoder/features',
    options: {
      description: 'Find features matching query',
      tags: ['api', 'geocoder'],
      validate: {
        query: getFeaturesRequest,
      },
      cache:
        CacheFactoryProvider.getFactory('client').createCache(
          CACHE_TTL_MS_CLIENT,
        ),
    },
    handler: async (request, h) => {
      const query = request.query as unknown as FeaturesQuery;
      return server.methods.feature(query, h.request);
    },
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/geocoder/reverse',
    options: {
      description:
        'Find addresses, POIs and stop places near the given coordinates',
      tags: ['api', 'geocoder'],
      validate: getFeaturesReverseRequest,
      cache:
        CacheFactoryProvider.getFactory('client').createCache(
          CACHE_TTL_MS_CLIENT,
        ),
    },
    handler: async (request, h) => {
      const query = request.query as unknown as ReverseFeaturesQuery;
      return server.methods.reverse(query, h.request);
    },
  });
};
