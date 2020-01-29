import { EnturService } from '@entur/sdk';
import { IJourneyService } from '../interface';
import { Result } from '@badrap/result';
import { APIError } from '../types';

export default (service: EnturService): IJourneyService => ({
  async getTrips({ from, to, when }) {
    try {
      const trips = await service.findTrips(from, to, when);
      return Result.ok(trips);
    } catch (error) {
      return Result.err(new APIError(error?.message));
    }
  },
  async getTripPatterns(query) {
    try {
      const trips = await service.getTripPatterns(query);
      return Result.ok(trips);
    } catch (error) {
      return Result.err(new APIError(error?.message));
    }
  }
});
