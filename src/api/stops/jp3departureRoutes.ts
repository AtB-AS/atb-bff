import { Boom } from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { NearestPlacesV3QueryVariables } from '../../service/impl/stops/journey-gql/jp3/nearest-places.graphql-gen';
import { StopPlaceQuayDeparturesQueryVariables } from '../../service/impl/stops/journey-gql/jp3/stop-place-quay-departures.graphql-gen';
import { IStopsService_v3 } from '../../service/interface';
import {
  getStopPlaceByPositionRequest,
  getStopPlaceQuayDeparturesRequest
} from './jp3schema';

export default (server: Hapi.Server) => (service: IStopsService_v3) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/stops/nearest',
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
    path: '/bff/v2/stop/quay-departures',
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
