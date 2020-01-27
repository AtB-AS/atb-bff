import { Coordinates, Feature, GetFeaturesParams } from '@entur/sdk';
import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import { makeGetFeatures, makeGetFeaturesReverse } from './geocoder';

export interface ReverseFeatureQuery {
  radius?: number;
  size?: number;
  layers?: string[];
}

export interface IGeocoderService {
  getFeatures(
    query: string,
    coords?: Coordinates,
    params?: GetFeaturesParams
  ): Promise<Feature[]>;
  getFeaturesReverse(
    coords: Coordinates,
    params?: ReverseFeatureQuery
  ): Promise<Feature[]>;
}

export default (server: Hapi.Server) => (service: IGeocoderService) => {
  const getFeatures = makeGetFeatures(service);
  server.route({
    method: 'GET',
    path: '/v1/geocoder/feature',
    handler: (request, h) => {
      const { query, lat, lon, params } = (request.query as unknown) as {
        query: string;
        lat?: number;
        lon?: number;
        params?: GetFeaturesParams;
      };
      const coords: Coordinates | undefined =
        lat && lon
          ? {
              latitude: lat,
              longitude: lon
            }
          : undefined;

      return getFeatures({ query, coords, ...params });
    },
    options: {
      tags: ['api'],
      validate: {
        query: Joi.object({
          query: Joi.string().required(),
          lat: Joi.number(),
          lon: Joi.number(),
          layers: Joi.string()
        })
      }
    }
  });

  const getFeaturesReverse = makeGetFeaturesReverse(service);
  server.route({
    method: 'GET',
    path: '/v1/geocoder/reverse',
    options: {
      validate: {
        query: Joi.object({
          lat: Joi.number().required(),
          lon: Joi.number().required(),
          layers: Joi.string(),
          radius: Joi.number(),
          size: Joi.number()
        })
      }
    },
    handler: (request, h) => {
      const { lat, lon, ...params } = (request.query as unknown) as {
        lat: number;
        lon: number;
        size?: number;
        layers?: string[];
        radius?: number;
      };

      const coords: Coordinates = {
        latitude: lat,
        longitude: lon
      };

      return getFeaturesReverse({
        coords,
        ...params
      });
    }
  });
};
