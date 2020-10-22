import Hapi from '@hapi/hapi';
import { EnrollmentQuery } from '../../service/types';
import { postEnrollmentGroupRequest } from './schema';
import * as Boom from '@hapi/boom';

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

      if (query.inviteKey === 'hurrafordeg') {
        return { status: 'ok', groups: ['ticketing_group'] };
      }

      return Boom.notFound('Ukjent kode');
    }
  });
};
