import Hapi from '@hapi/hapi';
import { IJourneyService } from '../../service/interface';
import { SingleTripPatternQuery } from '../../service/types';
import { postJourneyRequest, getSingleTripPattern } from './schema';
import { parseTripPatternId } from '../../utils/journey-utils';
import * as Boom from '@hapi/boom';

export default (server: Hapi.Server) => (service: IJourneyService) => {
  server.route({
    method: 'GET',
    path: '/bff/v1/journey/single-trip',
    options: {
      description: 'Get one specific trip pattern from generated ID',
      tags: ['api', 'journey'],
      validate: getSingleTripPattern
    },
    handler: async (request, h) => {
      const idParam = request.query as unknown as SingleTripPatternQuery;
      const idObject = parseTripPatternId(
        idParam.id,
        postJourneyRequest.payload
      );
      return (await service.getTripPattern(idObject)).unwrap(
        value =>
          !value
            ? Boom.resourceGone('Trip not found or is no longer available.')
            : value,
        error => Boom.internal(error.message)
      );
    }
  });
};
