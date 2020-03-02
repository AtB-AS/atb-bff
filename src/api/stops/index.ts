import { Boom } from '@hapi/boom';
import Hapi from '@hapi/hapi';

import { IStopsService } from '../../service/interface';
import {
  getStopPlaceRequest,
  getStopPlaceByPositionRequest,
  getStopPlaceDeparturesRequest,
  getStopPlaceQuaysRequest,
  getDeparturesFromQuayRequest,
  getDeparturesForServiceJourneyRequest,
  getDeparturesBetweenStopPlacesRequest,
  getStopPlacesByNameRequest
} from './schema';
import {
  StopPlaceQuery,
  DeparturesFromStopPlaceQuery,
  DeparturesForServiceJourneyQuery,
  QuaysForStopPlaceQuery,
  DeparturesFromQuayQuery,
  DeparturesBetweenStopPlacesQuery,
  StopPlaceByNameQuery
} from '../../service/types';

export default (server: Hapi.Server) => (service: IStopsService) => {
  server.route({
    method: 'GET',
    path: '/v1/stop/{id}',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceRequest,
      description: 'Get details for a StopPlace'
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const stop = await service.getStopPlace(id);

      if (stop.isOk && stop.value === null) {
        return new Boom(`stop with id ${id} not found`, {
          statusCode: 404
        });
      }

      return stop.unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/stop/{id}/quays',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceQuaysRequest,
      description: 'Get all quays that belongs to a StopPlace'
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const query = (request.query as unknown) as QuaysForStopPlaceQuery;
      const quays = await service.getQuaysForStopPlace(id, query);

      if (quays.isOk && quays.value === null) {
        return new Boom(`stop with id ${id} not found`, {
          statusCode: 404
        });
      }
      return quays.unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/quay/{id}/departures',
    options: {
      tags: ['api', 'stops'],
      validate: getDeparturesFromQuayRequest,
      description: 'Get departures from Quay'
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const query = (request.query as unknown) as DeparturesFromQuayQuery;
      return (await service.getDeparturesFromQuay(id, query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/servicejourney/{id}/departures',
    options: {
      tags: ['api', 'stops'],
      validate: getDeparturesForServiceJourneyRequest,
      description: 'Get departures for Service Journey'
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const {
        date
      } = (request.query as unknown) as DeparturesForServiceJourneyQuery;

      return await service.getDeparturesForServiceJourney(id, { date });
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/stop/{id}/departures',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceDeparturesRequest,
      description: 'Get departures from StopPlace'
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const query = (request.query as unknown) as DeparturesFromStopPlaceQuery;

      return (await service.getDeparturesFromStopPlace(id, query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/stops/nearest',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceByPositionRequest,
      description: 'Find stops near coordinates'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceQuery;
      return (await service.getStopPlacesByPosition(query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/stops',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlacesByNameRequest,
      description: 'Find stops matching query'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceByNameQuery;
      return (await service.getStopPlacesByName(query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/v1/departures',
    options: {
      tags: ['api', 'stops'],
      validate: getDeparturesBetweenStopPlacesRequest,
      description: 'Find departures between stop places'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as DeparturesBetweenStopPlacesQuery;
      return (await service.getDeparturesBetweenStopPlaces(query)).unwrap();
    }
  });
};
