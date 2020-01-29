import { Boom } from '@hapi/boom';
import Hapi from '@hapi/hapi';

import { IStopsService } from '../../service/interface';
import {
  getStopPlaceRequest,
  getStopPlaceByPositionRequest,
  getStopPlaceDeparturesRequest
} from './schema';
import {
  StopPlaceQuery,
  DeparturesFromStopPlaceQuery
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
        return new Boom(`stop with id ${id} not found`, { statusCode: 404 });
      }

      return stop.unwrap();
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
    path: '/v1/stops',
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
};
