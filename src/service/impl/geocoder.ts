import { Result } from '@badrap/result';
import { IGeocoderService } from '../interface';
import { APIError } from '../types';
import { EnturServiceAPI } from './entur';

const FOCUS_WEIGHT = parseInt(process.env.GEOCODER_FOCUS_WEIGHT || '18');

interface geocoderAnalyticsPublisher {
  getFeatures(query: string): Promise<void>
}

export default (
  service: EnturServiceAPI,
  publisher: geocoderAnalyticsPublisher
): IGeocoderService => {
  return {
    async getFeatures({ query, lat, lon, ...params }) {
      try {
        await publisher.getFeatures(query);
        const features = await service.getFeatures(
          query,
          { latitude: lat, longitude: lon },
          {
            // Set default focus point settings for better results
            // for local searches.
            'focus.weight': FOCUS_WEIGHT,
            'focus.scale': '200km',
            'focus.function': 'exp',
            ...params
          }
        );

        return Result.ok(features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getFeaturesReverse({ lat, lon, ...params }) {
      try {
        const features = await service.getFeaturesReverse(
          { latitude: lat, longitude: lon },
          { ...params }
        );

        return Result.ok(features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };
};
