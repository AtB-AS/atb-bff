import Hapi from '@hapi/hapi';
import { NearestPlacesV3QueryVariables } from '../../service/impl/departures/gql/jp3/stops-nearest.graphql-gen';
import { StopPlaceQuayDeparturesQueryVariables } from '../../service/impl/departures/gql/jp3/quay-departures.graphql-gen';
import { IDeparturesService } from '../../service/interface';
import {
  getStopPlaceByPositionRequest,
  getStopPlaceQuayDeparturesRequest
} from './schema';

export default (server: Hapi.Server) => (service: IDeparturesService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/stops-nearest',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceByPositionRequest,
      description: 'Find stops near coordinates'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as NearestPlacesV3QueryVariables;
      return (await service.getStopPlacesByPosition(query)).unwrap();
    }
  });
  server.route({
    method: 'GET',
    path: '/bff/v2/departures/quay-departures',
    options: {
      tags: ['api', 'stops'],
      validate: getStopPlaceQuayDeparturesRequest,
      description: 'Get stop with departures for every quay'
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as StopPlaceQuayDeparturesQueryVariables;
      return (await service.getStopPlaceQuayDepartures(query)).unwrap();
    }
  });
};
