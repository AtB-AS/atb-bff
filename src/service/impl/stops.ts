import { Result } from '@badrap/result';
import {
  EnturService,
  StopPlaceDetails,
  EstimatedCall,
  Quay
} from '@entur/sdk';
import haversineDistance from 'haversine-distance';
import { IStopsService } from '../interface';
import {
  APIError,
  DeparturesWithStop,
  DeparturesFromLocationQuery,
  FeatureLocation
} from '../types';

type EstimatedCallWithStop = EstimatedCall & { stop: StopPlaceDetails };

export default (service: EnturService): IStopsService => {
  const api: IStopsService = {
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
    async getDepartures(location, query) {
      const groupByQuays = (
        calls: EstimatedCall[],
        stop: StopPlaceDetails,
        limit: number
      ) => {
        return calls.reduce(
          function(obj, call) {
            const quayId = call.quay?.id ?? 'unknown';
            if (!obj.quays[quayId]) {
              obj.quays[quayId] = {
                quay: call.quay!,
                departures: []
              };
            }
            if (obj.quays[quayId].departures.length >= limit) return obj;

            obj.quays[quayId].departures.push(call);
            return obj;
          },
          {
            stop,
            quays: {}
          } as DeparturesWithStop
        );
      };
      const getDeparturesFromLocation = async (
        { latitude: lat, longitude: lon }: FeatureLocation['coordinates'],
        query: DeparturesFromLocationQuery
      ) => {
        const start = new Date(Date.now() + query.offset);
        let distanceTo = (latTarget: number, lonTarget: number) =>
          haversineDistance({ lat, lon }, { lat: latTarget, lon: lonTarget });
        const byDistance = (
          a: DeparturesWithStop,
          b: DeparturesWithStop
        ): number =>
          distanceTo(a.stop.latitude ?? 0, a.stop.longitude ?? 0) -
          distanceTo(b.stop.latitude ?? 0, b.stop.longitude ?? 0);
        const toDepartures = async (
          stop: StopPlaceDetails
        ): Promise<DeparturesWithStop> =>
          groupByQuays(
            await service.getDeparturesFromStopPlace(stop.id, {
              start,
              limit: query.limit * 3
            }),
            stop,
            query.limit
          );

        const stops = await service.getStopPlacesByPosition({
          latitude: lat,
          longitude: lon
        });
        const departures = await Promise.all(stops.map(toDepartures));
        return departures.sort(byDistance);
      };
      try {
        if (location.layer === 'venue') {
          const stop = await service.getStopPlace(location.id);
          const data = await service.getDeparturesFromStopPlace(location.id, {
            limit: query.limit * 3,
            includeNonBoarding: query.includeNonBoarding
          });
          return Result.ok([groupByQuays(data, stop, query.limit)]);
        }

        const data = await getDeparturesFromLocation(
          location.coordinates,
          query
        );
        return Result.ok(data);
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
      const start = new Date(Date.now() + query.offset);
      const byDepartureTime = (a: EstimatedCall, b: EstimatedCall): number =>
        new Date(a.expectedDepartureTime).getTime() -
        new Date(b.expectedDepartureTime).getTime();
      const byDistance = (
        a: EstimatedCallWithStop,
        b: EstimatedCallWithStop
      ): number =>
        haversineDistance(
          { latitude: a.stop.latitude, longitude: a.stop.longitude },
          { latitude: lat, longitude: lon }
        ) -
        haversineDistance(
          { latitude: b.stop.latitude, longitude: b.stop.longitude },
          { latitude: lat, longitude: lon }
        );
      const byFlattening = <T>(a: T[], b: T[]) => a.concat(b);
      const overServiceJourneyId = (
        a: { [key: string]: EstimatedCall },
        b: EstimatedCall
      ) => ({ ...a, [b.serviceJourney.id]: b });
      const toDepartures = async (
        stop: StopPlaceDetails
      ): Promise<EstimatedCallWithStop[]> =>
        (
          await service.getDeparturesFromStopPlace(stop.id, {
            start,
            limit: 10
          })
        ).map(d => ({ ...d, stop }));
      try {
        const stops = await service.getStopPlacesByPosition({
          latitude: lat,
          longitude: lon
        });
        const departures = await Promise.all(stops.map(toDepartures));
        const departuresByDistanceAndTime = Object.values(
          departures
            .reduce(byFlattening, [])
            .sort(byDistance)
            .reduceRight(overServiceJourneyId, {})
        ).sort(byDepartureTime);

        return Result.ok(departuresByDistanceAndTime);
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
  };

  return api;
};
