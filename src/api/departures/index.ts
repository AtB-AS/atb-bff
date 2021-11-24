import Hapi from '@hapi/hapi';
import { NearestStopPlacesQueryVariables } from '../../service/impl/departures/gql/jp3/stops-nearest.graphql-gen';
import { StopPlaceQuayDeparturesQueryVariables } from '../../service/impl/departures/gql/jp3/stop-departures.graphql-gen';
import { IDeparturesService } from '../../service/interface';
import {
  getStopsNearestRequest,
  getStopDeparturesRequest,
  getDepartureRealtime
} from './schema';
import { DepartureRealtimeQuery } from '../../service/types';

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
    path: '/bff/v2/departures/stop-departures',
    options: {
      tags: ['api', 'departures', 'quay', 'estimatedCalls'],
      validate: getStopDeparturesRequest,
      description: 'Get stop with departures for every quay'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceQuayDeparturesQueryVariables;
      return (await service.getStopPlaceQuayDepartures(query)).unwrap();
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
};
