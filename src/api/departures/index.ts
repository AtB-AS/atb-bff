import Hapi from '@hapi/hapi';
import { StopPlaceQuayDeparturesQueryVariables } from '../../service/impl/departures/journey-gql/stop-departures.graphql-gen';
import { IDeparturesService } from '../../service/interface';
import {
  getStopDeparturesRequest,
  getQuayDeparturesRequest,
  getStopsNearestRequest,
  getStopsDetailsRequest,
  postStopDeparturesRequest,
  postQuayDeparturesRequest,
  postDeparturesRequest
} from './schema';
import {
  DeparturesPayload,
  QuayDeparturesQueryVariables
} from '../../service/types';
import { NearestStopPlacesQueryVariables } from '../../service/impl/departures/journey-gql/stops-nearest.graphql-gen';
import { StopsDetailsQueryVariables } from '../../service/impl/departures/journey-gql/stops-details.graphql-gen';
import { DeparturesQueryVariables } from '../../service/impl/departures/journey-gql/departures.graphql-gen';

export default (server: Hapi.Server) => (service: IDeparturesService) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/departures/departures',
    options: {
      tags: ['api', 'departures', 'quay', 'estimatedCalls'],
      validate: postDeparturesRequest,
      description:
        'Get departures for a list of quays, and optionally filter on favorites'
    },
    handler: async (request, h) => {
      const query = request.query as unknown as DeparturesQueryVariables;
      const payload = request.payload as unknown as DeparturesPayload;
      return (await service.getDepartures(query, payload, h.request)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stops-nearest',
    options: {
      tags: ['api', 'departures', 'stop'],
      validate: getStopsNearestRequest,
      description: 'Find stops near coordinates'
    },
    handler: async (request, h) => {
      const query = request.query as unknown as NearestStopPlacesQueryVariables;
      return (await service.getStopPlacesByPosition(query, h.request)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stops-details',
    options: {
      tags: ['api', 'departures', 'stop'],
      validate: getStopsDetailsRequest,
      description: 'Get details for an array of stop places'
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopsDetailsQueryVariables;
      return (await service.getStopsDetails(query, h.request)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stop-departures',
    options: {
      tags: ['api', 'departures', 'stopPlace', 'estimatedCalls'],
      validate: getStopDeparturesRequest,
      description: 'Get stop with departures for every quay',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query =
        request.query as unknown as StopPlaceQuayDeparturesQueryVariables;
      return (await service.getStopQuayDepartures(query, h.request)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/departures/stop-departures',
    options: {
      tags: ['api', 'departures', 'stopPlace', 'estimatedCalls'],
      validate: postStopDeparturesRequest,
      description:
        'Get stop with departures for every quay, and optionally filter on favorites',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query =
        request.query as unknown as StopPlaceQuayDeparturesQueryVariables;
      const payload = request.payload as unknown as DeparturesPayload;
      return (
        await service.getStopQuayDepartures(query, h.request, payload)
      ).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/quay-departures',
    options: {
      tags: ['api', 'departures', 'quay', 'estimatedCalls'],
      validate: getQuayDeparturesRequest,
      description: 'Get departures from a quay',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = request.query as unknown as QuayDeparturesQueryVariables;
      const response = (
        await service.getDepartures(
          {
            ...query,
            ids: [query.id]
          },
          {},
          h.request
        )
      ).unwrap();
      return { quay: response.quays[0] };
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/departures/quay-departures',
    options: {
      tags: ['api', 'departures', 'quay', 'estimatedCalls'],
      validate: postQuayDeparturesRequest,
      description:
        'Get departures from a quay, and optionally filter on favorites',
      plugins: {
        'hapi-swagger': {
          deprecated: true
        }
      }
    },
    handler: async (request, h) => {
      const query = request.query as unknown as QuayDeparturesQueryVariables;
      const payload = request.payload as unknown as DeparturesPayload;
      const response = (
        await service.getDepartures(
          {
            ...query,
            ids: [query.id]
          },
          payload,
          h.request
        )
      ).unwrap();
      return { quay: response.quays[0] };
    }
  });
};
