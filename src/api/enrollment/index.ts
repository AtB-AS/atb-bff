import Hapi from '@hapi/hapi';
import { EnrollmentQuery } from '../../service/types';
import { postEnrollmentGroupRequest } from './schema';
import * as Boom from '@hapi/boom';
import { PERIOD_TICKET_INVITE_KEY, TICKET_INVITE_KEY, FLEX_TICKET_INVITE_KEY } from '../../config/env';

export default (server: Hapi.Server) => () => {
  server.route({
    method: 'POST',
    path: '/bff/v1/enrollment/group',
    options: {
      description: 'Enroll in beta groups with invite key',
      tags: ['api', 'enrollment'],
      validate: postEnrollmentGroupRequest
    },
    handler: async (request, h) => {
      const query = (request.query as unknown) as EnrollmentQuery;

      if (TICKET_INVITE_KEY && TICKET_INVITE_KEY === query.inviteKey) {
        return { status: 'ok', groups: ['ticketing_group'] };
      }

      if (
        PERIOD_TICKET_INVITE_KEY &&
        PERIOD_TICKET_INVITE_KEY === query.inviteKey
      ) {
        return {
          status: 'ok',
          groups: ['ticketing_group', 'period_ticketing_group']
        };
      }

      if (
        FLEX_TICKET_INVITE_KEY &&
        FLEX_TICKET_INVITE_KEY === query.inviteKey
      ) {
        return {
          status: 'ok',
          groups: ['ticketing_group', 'flex_ticketing_group']
        };
      }

      return Boom.badData('Ukjent kode');
    }
  });
};
