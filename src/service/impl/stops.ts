import { Result } from '@badrap/result';
import {
  EnturService,
  StopPlaceDetails,
  EstimatedCall,
  DeparturesById
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
    try {
      const stops = await service.getStopPlacesByPosition({
        latitude: lat,
        longitude: lon
      });
      const stopIds = stops.map(s => s.id);
      const departures = (
        await service.getDeparturesFromStopPlaces(stopIds)
      ).filter(d => d !== undefined) as DeparturesById[];

      const departuresWithStopName: DeparturesByIdWithStopName[] = departures.map(
        d => ({
          ...d,
          name: stops.find(s => s.id === d.id)?.name ?? 'UNKNOWN'
        })
      );

      return Result.ok(departuresWithStopName);
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
