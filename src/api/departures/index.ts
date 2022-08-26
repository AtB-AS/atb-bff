import Hapi from '@hapi/hapi';
import { StopPlaceQuayDeparturesQueryVariables } from '../../service/impl/departures/gql/jp3/stop-departures.graphql-gen';
import { IDeparturesService } from '../../service/interface';
import {
  getStopDeparturesRequest,
  getDepartureRealtime,
  getQuayDeparturesRequest,
  getStopsNearestRequest,
  getStopsDetailsRequest,
  postStopDeparturesRequest,
  postQuayDeparturesRequest,
  getFavoriteDeparturesParams,
  getFavoriteDeparturesParams2
} from './schema';
import {
  DepartureRealtimeQuery,
  QuayDeparturesPayload,
  StopPlaceDeparturesPayload
} from '../../service/types';
import { QuayDeparturesQueryVariables } from '../../service/impl/departures/gql/jp3/quay-departures.graphql-gen';
import { NearestStopPlacesQueryVariables } from '../../service/impl/departures/gql/jp3/stops-nearest.graphql-gen';
import { StopsDetailsQueryVariables } from '../../service/impl/departures/gql/jp3/stops-details.graphql-gen';
import { FavouriteDepartureQueryVariables } from '../../service/impl/departures/gql/jp3/favourite-departure.graphql-gen';
import { FavouriteDepartureAPIParam } from '../../types/departures';

export default (server: Hapi.Server) => (service: IDeparturesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stops-nearest',
    options: {
      tags: ['api', 'departures', 'stop'],
      validate: getStopsNearestRequest,
      description: 'Find stops near coordinates'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as NearestStopPlacesQueryVariables;
      return (await service.getStopPlacesByPosition(query)).unwrap();
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
      const query = (request.query as unknown) as StopsDetailsQueryVariables;
      return (await service.getStopsDetails(query)).unwrap();
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
      const query = (request.query as unknown) as StopPlaceQuayDeparturesQueryVariables;
      return (await service.getStopQuayDepartures(query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/departures/stop-departures',
    options: {
      tags: ['api', 'departures', 'stopPlace', 'estimatedCalls'],
      validate: postStopDeparturesRequest,
      description:
        'Get stop with departures for every quay, and optionally filter on favorites'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceQuayDeparturesQueryVariables;
      const payload = (request.payload as unknown) as StopPlaceDeparturesPayload;
      return (await service.getStopQuayDepartures(query, payload)).unwrap();
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
      const query = (request.query as unknown) as QuayDeparturesQueryVariables;
      return (await service.getQuayDepartures(query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/departures/quay-departures',
    options: {
      tags: ['api', 'departures', 'quay', 'estimatedCalls'],
      validate: postQuayDeparturesRequest,
      description:
        'Get departures from a quay, and optionally filter on favorites'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as QuayDeparturesQueryVariables;
      const payload = (request.payload as unknown) as QuayDeparturesPayload;
      return (await service.getQuayDepartures(query, payload)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/realtime',
    options: {
      tags: ['api', 'quays', 'departures', 'realtime'],
      validate: getDepartureRealtime,
      description: 'Get updated realtime information for the given quays'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as DepartureRealtimeQuery;
      return (await service.getDepartureRealtime(query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/bff/v2/departures/favourites',
    options: {
      tags: ['api', 'favourites', 'departures'],
      validate: getFavoriteDeparturesParams2,
      description: 'Get favourite departures'
    },
    handler: async (request, h) => {
      console.log('## raw payload', request.payload);

      const query = (request.payload as unknown) as FavouriteDepartureAPIParam[];
      const result = (await service.getFavouriteDepartures(query)).unwrap();
      console.log('## Unwrapped response:', JSON.stringify(result));
      return result;
    }
  });
};
