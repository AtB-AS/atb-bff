import Hapi, {ReqRefDefaults, Request} from '@hapi/hapi';
import qs from 'querystring';

import {IGeocoderService_v3} from '../../service/interface';
import {getFeaturesV3Request, getFeaturesReverseV3Request} from './schema';
import {FeaturesV3Query, ReverseFeaturesV3Query} from '../../service/types';
import {
  CACHE_TTL_MS_CLIENT,
  CACHE_TTL_MS_SERVER_GEOCODER_FEATURES,
  CACHE_TTL_MS_SERVER_GEOCODER_REVERSE,
} from '../../config/env';
import {getClientCache, getServerCache} from '../../utils/cache';

export default (server: Hapi.Server) => (service: IGeocoderService_v3) => {
  const getFeatures = async (q: FeaturesV3Query, h: Request<ReqRefDefaults>) =>
    (await service.getFeatures(q, h)).unwrap();
  const getFeaturesReverse = async (
    q: ReverseFeaturesV3Query,
    h: Request<ReqRefDefaults>,
  ) => (await service.getFeaturesReverse(q, h)).unwrap();

  server.method('feature_v3', getFeatures, {
    generateKey: (q: FeaturesV3Query) => qs.stringify(q as any),
    cache: getServerCache(CACHE_TTL_MS_SERVER_GEOCODER_FEATURES),
  });
  server.method('reverse_v3', getFeaturesReverse, {
    generateKey: (q: ReverseFeaturesV3Query) => qs.stringify(q as any),
    cache: getServerCache(CACHE_TTL_MS_SERVER_GEOCODER_REVERSE),
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/geocoder/features',
    options: {
      description: 'Find features matching query',
      tags: ['api', 'geocoder'],
      validate: {
        query: getFeaturesV3Request,
      },
      cache: getClientCache(CACHE_TTL_MS_CLIENT),
    },
    handler: async (request, h) => {
      const query = request.query as unknown as FeaturesV3Query;
      return server.methods.feature_v3(query, h.request);
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/geocoder/reverse',
    options: {
      description:
        'Find addresses, POIs and stop places near the given coordinates',
      tags: ['api', 'geocoder'],
      validate: {
        query: getFeaturesReverseV3Request,
      },
      cache: getClientCache(CACHE_TTL_MS_CLIENT),
    },
    handler: async (request, h) => {
      const query = request.query as unknown as ReverseFeaturesV3Query;
      return server.methods.reverse_v3(query, h.request);
    },
  });
};
