import Hapi from '@hapi/hapi';
import {IDeparturesService} from '../../service/interface';
import {
  getStopsNearestRequest,
  getStopsDetailsRequest,
  postDeparturesRequest,
} from './schema';
import {DeparturesPayload} from '../../service/types';
import {NearestStopPlacesQueryVariables} from '../../service/impl/departures/journey-gql/stops-nearest.graphql-gen';
import {StopsDetailsQueryVariables} from '../../service/impl/departures/journey-gql/stops-details.graphql-gen';
import {DeparturesQueryVariables} from '../../service/impl/departures/journey-gql/departures.graphql-gen';

export default (server: Hapi.Server) => (service: IDeparturesService) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/departures/departures',
    options: {
      tags: ['api', 'departures', 'quay', 'estimatedCalls'],
      validate: postDeparturesRequest,
      description:
        'Get departures for a list of quays, and optionally filter on favorites',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as DeparturesQueryVariables;
      const payload = request.payload as unknown as DeparturesPayload;
      return (await service.getDepartures(query, payload, h.request)).unwrap();
    },
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stops-nearest',
    options: {
      tags: ['api', 'departures', 'stop'],
      validate: getStopsNearestRequest,
      description: 'Find stops near coordinates',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as NearestStopPlacesQueryVariables;
      return (await service.getStopPlacesByPosition(query, h.request)).unwrap();
    },
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stops-details',
    options: {
      tags: ['api', 'departures', 'stop'],
      validate: getStopsDetailsRequest,
      description: 'Get details for an array of stop places',
    },
    handler: async (request, h) => {
      const query = request.query as unknown as StopsDetailsQueryVariables;
      return (await service.getStopsDetails(query, h.request)).unwrap();
    },
  });
};
