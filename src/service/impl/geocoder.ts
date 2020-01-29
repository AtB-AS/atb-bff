import { Result } from '@badrap/result';
import { EnturService } from '@entur/sdk';
import { IGeocoderService } from '../interface';
import { APIError } from '../types';

export default (service: EnturService): IGeocoderService => ({
  async getFeatures({ query, lat, lon, ...params }) {
    try {
      const features = await service.getFeatures(
        query,
        { latitude: lat, longitude: lon },
        { ...params }
      );

      return Result.ok(features);
    } catch (error) {
      return Result.err(new APIError(error?.message));
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
      return Result.err(new APIError(error?.message));
    }
  }
});
