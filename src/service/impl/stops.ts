import { Result } from '@badrap/result';
import { EnturService } from '@entur/sdk';
import { IStopsService } from '../interface';
import { APIError } from '../types';

export default (service: EnturService): IStopsService => ({
  async getStopPlace(id) {
    try {
      const stop = await service.getStopPlace(id);
      return Result.ok(stop);
    } catch (error) {
      if (error instanceof Error) {
        const re = /Entur SDK: No data available/;
        if (error.message.match(re)) return Result.ok(null);
      }
      return Result.err(new APIError(error?.message));
    }
  },
  async getDeparturesFromStopPlace(id, query) {
    try {
      const departures = await service.getDeparturesFromStopPlace(id);

      return Result.ok(departures);
    } catch (error) {
      return Result.err(new APIError(error?.message));
    }
  },
  async getStopPlacesByPosition({ lat: latitude, lon: longitude, distance }) {
    try {
      const stops = await service.getStopPlacesByPosition(
        {
          latitude,
          longitude
        },
        distance
      );

      return Result.ok(stops);
    } catch (error) {
      return Result.err(new APIError(error?.message));
    }
  }
});
