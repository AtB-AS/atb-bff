import {Result} from '@badrap/result';
import {IGeocoderService} from '../interface';
import {APIError} from '../../utils/api-error';
import {EnturServiceAPI} from './entur';

const FOCUS_WEIGHT = parseInt(process.env.GEOCODER_FOCUS_WEIGHT || '18');

export default (service: EnturServiceAPI): IGeocoderService => {
  return {
    async getFeatures({query, lat, lon, ...params}) {
      try {
        const features = await service.getFeatures(
          query,
          {latitude: lat, longitude: lon},
          {
            // Set default focus point settings for better results
            // for local searches.
            'focus.weight': FOCUS_WEIGHT,
            'focus.scale': '200km',
            'focus.function': 'exp',
            ...params,
          },
        );

        return Result.ok(features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getFeaturesReverse({lat, lon, ...params}) {
      try {
        const features = await service.getFeaturesReverse(
          {latitude: lat, longitude: lon},
          {...params},
        );

        return Result.ok(features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
