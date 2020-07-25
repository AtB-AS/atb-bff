import Hapi from '@hapi/hapi';

import { IGeocoderService } from '../../service/interface';
import { getFeaturesRequest, getFeaturesReverseRequest } from './schema';
import { FeaturesQuery, ReverseFeaturesQuery } from '../../service/types';
import { RouteOptions } from '..';

export const getFeatures: Hapi.Plugin<RouteOptions<IGeocoderService>> = {
  name: 'route.geocoder.features',
  dependencies: 'service.geocoder',
  register: (server, options) => {
    server.route({
      method: 'GET',
      path: '/v1/geocoder/features',
      options: {
        description: 'Find features matching query',
        tags: ['api', 'geocoder'],
        validate: {
          query: getFeaturesRequest
        }
      },
      handler: async (request, h) => {
        const query = (request.query as unknown) as FeaturesQuery;
        return (await server.methods.geocoder.features(query)).unwrap();
      }
    });
  }
};

export const getFeaturesReverse: Hapi.Plugin<RouteOptions<IGeocoderService>> = {
  name: 'route.geocoder.getFeaturesReverse',
  dependencies: 'service.geocoder',
  register: (server, opts) => {
    server.method('reverse', async (q: ReverseFeaturesQuery) => {
      const res = await opts.deps?.getFeaturesReverse(q);
      return res?.unwrap();
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
        return server.methods.geocoder.reverse(query);
      }
    });
  }
};
