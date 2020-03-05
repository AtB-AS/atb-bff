import { Result } from '@badrap/result';
import {
  EnturService,
  StopPlaceDetails,
  DeparturesById,
  EstimatedCall,
  StopPlace
} from '@entur/sdk';
import { IStopsService } from '../interface';
import { APIError, DeparturesByIdWithStopName } from '../types';

export default (service: EnturService): IStopsService => ({
  async getDeparturesBetweenStopPlaces({ from, to }, params) {
    try {
      const departures = await service.getDeparturesBetweenStopPlaces(
        from,
        to,
        params
      );
      return Result.ok(departures);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  async getStopPlacesByName({ query, lat, lon }) {
    try {
      const coordinates =
        lat && lon ? { latitude: lat, longitude: lon } : undefined;
      const features = await service.getFeatures(query, coordinates, {
        layers: ['venue']
      });
      const isStop = /^NSR:StopPlace:\d+$/;

      const stopIDs = features
        .filter(f => f.properties.id.match(isStop))
        .map(s => s.properties.id);

      const stops = (await service.getStopPlaces(stopIDs)).filter(
        s => s !== undefined
      ) as StopPlaceDetails[];

      return Result.ok(stops);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  async getStopPlace(id) {
    try {
      const stop = await service.getStopPlace(id);
      return Result.ok(stop);
    } catch (error) {
      if (error instanceof Error) {
        const re = /Entur SDK: No data available/;
        if (error.message.match(re)) return Result.ok(null);
      }
      return Result.err(new APIError(error));
    }
  },
  async getDeparturesFromStopPlace(id, query) {
    try {
      const departures = await service.getDeparturesFromStopPlace(id, query);

      return Result.ok(departures);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  async getDeparturesFromQuay(id, query) {
    const q: any = {
      omitNonBoarding: false
    };
    try {
      const departures = await service.getDeparturesFromQuays([id], q);
      if (departures.length > 0 && departures[0]?.departures) {
        return Result.ok(departures[0]?.departures);
      }
      return Result.ok([]);
    } catch (error) {
      return Result.err(new APIError(error));
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
      return Result.err(new APIError(error));
    }
  },
  async getNearestPlaces({ lat, lon, ...query }) {
    try {
      const places = await service.getNearestPlaces({
        latitude: lat,
        longitude: lon
      });
      return Result.ok(places);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  async getNearestDepartures({ lat, lon, ...query }) {
    const when = new Date(Date.now() + 1 * 60 * 1000);
    const byDepartureTime = (a: EstimatedCall, b: EstimatedCall): number =>
      new Date(b.expectedDepartureTime).getTime() -
      new Date(a.expectedDepartureTime).getTime();
    const byFlattening = (a: any[], b: any[]) => a.concat(b);
    const overServiceJourneyId = (
      a: { [key: string]: EstimatedCall },
      b: EstimatedCall
    ) => ({ ...a, [b.serviceJourney.id]: b });
    const toDepartures = (stop: StopPlace): Promise<EstimatedCall[]> =>
      service.getDeparturesFromStopPlace(stop.id, {
        timeRange: 10 * 60,
        start: when
      });
    try {
      const stops = await service.getStopPlacesByPosition({
        latitude: lat,
        longitude: lon
      });

      const departures = (await Promise.all(stops.map(toDepartures)))
        .reduce(byFlattening)
        .sort(byDepartureTime)
        .reduceRight(overServiceJourneyId, {});

      return Result.ok(Object.values(departures).sort(byDepartureTime));
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
  async getQuaysForStopPlace(id, query) {
    try {
      const quays = await service.getQuaysForStopPlace(id, query);

      return Result.ok(quays);
    } catch (error) {
      if (error instanceof Error) {
        const re = /Entur SDK: No data available/;
        if (error.message.match(re)) return Result.ok(null);
      }
      return Result.err(new APIError(error));
    }
  },
  async getDeparturesForServiceJourney(id, { date }) {
    try {
      const departures = await service.getDeparturesForServiceJourney(
        id,
        date?.toISOString()
      );

      return Result.ok(departures);
    } catch (error) {
      const re = /Entur SDK: No data available/;
      if (error.message.match(re)) return Result.ok(null);

      return Result.err(new APIError(error));
    }
  }
});
