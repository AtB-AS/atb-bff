import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { IJourneyService } from '../../service/interface';
import { TripQuery, TripPatternsQuery } from '../../service/types';
import { postJourneyRequest, getJourneyRequest } from './schema';

export default (server: Hapi.Server) => (service: IJourneyService) => {
  server.route({
    method: 'GET',
    path: '/v1/journey/trip',
    options: {
      description: 'Find trip patterns with a simple query',
      tags: ['api', 'journey'],
      validate: getJourneyRequest
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as TripQuery;
      return (await service.getTrips(query)).unwrap();
    }
  });
  server.route({
    method: 'POST',
    path: '/v1/journey/trip',
    options: {
      description: 'Find trip patterns',
      tags: ['api', 'journey'],
      validate: postJourneyRequest
    },
    handler: async (request, h) => {
      const query = (request.payload as unknown) as TripPatternsQuery;
      return (await service.getTripPatterns(query)).unwrap();
    }
  });
};
