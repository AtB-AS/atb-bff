import Hapi from '@hapi/hapi';

import {
  Feature,
  GetFeaturesParams,
  GetFeaturesReverseParam,
  Coordinates
} from '@entur/sdk';
import {
  APIError,
  FeaturesQuery,
  ReverseFeaturesQuery
} from '../../service/types';
import { Result } from '@badrap/result';

interface Options {}

interface IGeocoderImpl {
  getFeatures: (
    query: string,
    coords?: Coordinates,
    params?: GetFeaturesParams
  ) => Promise<Feature[]>;

  getFeaturesReverse: (
    coords: Coordinates,
    params?: GetFeaturesReverseParam
  ) => Promise<Feature[]>;
}

export const createStubGeocoderImpl = (): IGeocoderImpl => ({
  getFeatures: () => Promise.resolve([]),
  getFeaturesReverse: () => Promise.resolve([])
});

export default (geocoder: IGeocoderImpl): Hapi.Plugin<Options> => ({
  name: 'service.geocoder',
  register: (server, options) => {
    server.method(
      'geocoder.reverse',
      async ({
        lat,
        lon,
        ...params
      }: ReverseFeaturesQuery): Promise<Result<Feature[], APIError>> => {
        try {
          const features = await geocoder.getFeaturesReverse(
            { latitude: lat, longitude: lon },
            { ...params }
          );

          return Result.ok(features);
        } catch (error) {
          return Result.err(new APIError(error));
        }
      }
    );
    server.method({
      name: 'geocoder.features',
      method: async ({
        query,
        lat,
        lon,
        ...params
      }: FeaturesQuery): Promise<Result<Feature[], APIError>> => {
        try {
          const features = await geocoder.getFeatures(
            query,
            { latitude: lat, longitude: lon },
            { ...params }
          );
          return Result.ok(features);
        } catch (error) {
          return Result.err(new APIError(error));
        }
      }
    });
  }
});

declare module '@hapi/hapi' {
  interface ServerMethods {
    geocoder: {
      features: (q: FeaturesQuery) => Promise<Result<Feature[], APIError>>;
      reverse: (
        q: ReverseFeaturesQuery
      ) => Promise<Result<Feature[], APIError>>;
    };
  }
}
