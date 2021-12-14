import Hapi from '@hapi/hapi';
import { StopPlaceQuayDeparturesQueryVariables } from '../../service/impl/departures/gql/jp3/stop-departures.graphql-gen';
import { IDeparturesService } from '../../service/interface';
import {
  getStopDeparturesRequest,
  getDepartureRealtime,
  getQuayDeparturesRequest
} from './schema';
import { DepartureRealtimeQuery } from '../../service/types';
import { QuayDeparturesQueryVariables } from '../../service/impl/departures/gql/jp3/quay-departures.graphql-gen';

export default (server: Hapi.Server) => (service: IDeparturesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stop-departures',
    options: {
      tags: ['api', 'departures', 'stopPlace', 'estimatedCalls'],
      validate: getStopDeparturesRequest,
      description: 'Get stop with departures for every quay'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceQuayDeparturesQueryVariables;
      return (await service.getStopQuayDepartures(query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/quay-departures',
    options: {
      tags: ['api', 'departures', 'quay', 'estimatedCalls'],
      validate: getQuayDeparturesRequest,
      description: 'Get departures from a quay'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as QuayDeparturesQueryVariables;
      return (await service.getQuayDepartures(query)).unwrap();
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
