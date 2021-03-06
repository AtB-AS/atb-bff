import { Boom } from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { IStopsService } from '../../service/interface';
import {
  DepartureGroupsPayload,
  DepartureGroupsQuery,
  DepartureRealtimeQuery,
  DeparturesBetweenStopPlacesQuery,
  DeparturesFromLocationPagingQuery,
  DeparturesFromLocationQuery,
  DeparturesFromQuayQuery,
  DeparturesFromStopPlaceQuery,
  FeatureLocation,
  NearestDeparturesQuery,
  QuaysForStopPlaceQuery,
  StopPlaceByNameQuery,
  StopPlaceQuery
} from '../../service/types';
import {
  getDepartureRealtime,
  getDeparturesBetweenStopPlacesRequest,
  getDeparturesCursoredRequest,
  getDeparturesFromQuayRequest,
  getDeparturesPagingRequest,
  getDeparturesRequest,
  getNearestDeparturesRequest,
  getStopPlaceByPositionRequest,
  getStopPlaceDeparturesRequest,
  getStopPlaceQuaysRequest,
  getStopPlaceRequest,
  getStopPlacesByNameRequest
} from './schema';

export default (server: Hapi.Server) => (service: IStopsService) => {
  server.route({
    method: 'GET',
    path: '/bff/v1/stop/{id}',
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
    path: '/bff/v1/stop/{id}/quays',
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
    path: '/bff/v1/quay/{id}/departures',
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
    path: '/bff/v1/departures/nearest',
    options: {
      tags: ['api', 'stops'],
      validate: getNearestDeparturesRequest,
      description:
        'Get departures from stops near coordinates. Deprecated: Use POST /v1/departures-from-location instead',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as NearestDeparturesQuery;
      return (await service.getNearestDepartures(query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/stop/{id}/departures',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceDeparturesRequest,
      description:
        'Get departures from StopPlace. Deprecated: Use POST /v1/departures-from-location instead',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const query = (request.query as unknown) as DeparturesFromStopPlaceQuery;
      return (await service.getDeparturesFromStopPlace(id, query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/stops/nearest',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceByPositionRequest,
      description: 'Find stops near coordinates',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceQuery;
      return (await service.getStopPlacesByPosition(query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/stops',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlacesByNameRequest,
      description: 'Find stops matching query',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceByNameQuery;
      return (await service.getStopPlacesByName(query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/departures',
    options: {
      tags: ['api', 'stops'],
      validate: getDeparturesBetweenStopPlacesRequest,
      description: 'Find departures between stop places',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as DeparturesBetweenStopPlacesQuery;
      return (await service.getDeparturesBetweenStopPlaces(query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v1/departures-from-location',
    options: {
      tags: ['api', 'stops', 'departures'],
      validate: getDeparturesRequest,
      description: 'Get departures from feature location',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const locaton = (request.payload as unknown) as FeatureLocation;
      const query = (request.query as unknown) as DeparturesFromLocationQuery;

      return (await service.getDepartures(locaton, query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v1/departures-from-location-paging',
    options: {
      tags: ['api', 'stops', 'departures'],
      validate: getDeparturesPagingRequest,
      description: 'Get departures from feature location',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const location = (request.payload as unknown) as FeatureLocation;
      const query = (request.query as unknown) as DeparturesFromLocationPagingQuery;
      return (await service.getDeparturesPaging(location, query)).unwrap();
    }
  });

  server.route({
    method: 'POST',
    path: '/bff/v1/departures-grouped',
    options: {
      tags: ['api', 'stops', 'departures'],
      validate: getDeparturesCursoredRequest,
      description: 'Get departures grouped on lines from feature location'
    },
    handler: async (request, h) => {
      const location = (request.payload as unknown) as DepartureGroupsPayload;
      const query = (request.query as unknown) as DepartureGroupsQuery;
      return (await service.getDeparturesGrouped(location, query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v1/departures-realtime',
    options: {
      tags: ['api', 'stops', 'departures', 'realtime'],
      validate: getDepartureRealtime,
      description:
        'Get updated realtime information of all lines and quays passed as data'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as DepartureRealtimeQuery;
      return (await service.getDepartureRealtime(query)).unwrap();
    }
  });
};
