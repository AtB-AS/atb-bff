import {
  Coordinates,
  StopPlace,
  GetDeparturesParams,
  Departure
} from '@entur/sdk';
import { Boom } from '@hapi/boom';
import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import {
  makeFindStops,
  makeGetStopDepartures,
  makeGetStopPlace
} from './stops';

export interface IStopsService {
  getStopPlace(id: string): Promise<StopPlace>;
  getStopPlacesByPosition(
    coordinates: Coordinates,
    distance?: number
  ): Promise<StopPlace[]>;
  getDeparturesFromStopPlace(
    stopPlaceId: string,
    params?: GetDeparturesParams
  ): Promise<Departure[]>;
}

export default (server: Hapi.Server) => (service: IStopsService) => {
  const getStopPlace = makeGetStopPlace(service);
  const getStopDepartures = makeGetStopDepartures(service);
  const findStops = makeFindStops(service);

  server.route({
    method: 'GET',
    path: '/v1/stop/{id}',
    options: {
      tags: ['api'],
      description: 'wut',
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      }
    },

    handler: async (request, h) => {
      const { id } = request.params;
      const stop = await getStopPlace(id);
      if (stop === null) {
        throw new Boom(`stop place with id ${id} not found`, {
          statusCode: 404
        });
      }
      return stop;
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/stop/{id}/departures',
    options: {
      validate: {
        query: Joi.object({
          startTime: Joi.date().default(new Date()),
          timeRange: Joi.number().default(86400),
          departures: Joi.number().default(5),
          includeNonBoarding: Joi.bool().default(false)
        })
      }
    },
    handler: (request, h) => {
      const { id } = request.params;
      const params = (request.query as unknown) as {
        startTime: Date;
        timeRange: number;
        departures: number;
        includeNonBoarding: boolean;
      };

      return getStopDepartures({ id, ...params });
    }
  });

  server.route({
    method: 'GET',
    path: '/v1/stops',
    options: {
      validate: {
        query: Joi.object({
          lat: Joi.number().required(),
          lon: Joi.number().required(),
          distance: Joi.number()
        })
      }
    },
    handler: (request, h) => {
      const { lat, lon, distance } = (request.query as unknown) as {
        lat: number;
        lon: number;
        distance?: number;
      };
      const coords: Coordinates = {
        latitude: lat,
        longitude: lon
      };

      return findStops({ coords, distance });
    }
  });
};
