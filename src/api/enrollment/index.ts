import Hapi from '@hapi/hapi';
import {EnrollmentQuery} from '../../service/types';
import {postEnrollmentGroupRequest} from './schema';
import * as Boom from '@hapi/boom';
import {
  PERIOD_TICKET_INVITE_KEY,
  TICKET_INVITE_KEY,
  FLEX_TICKET_INVITE_KEY,
  SHMO_INVITE_KEY,
  BONUS_INVITE_KEY_A,
  BONUS_INVITE_KEY_B,
} from '../../config/env';
import {IEnrollmentService} from '../../service/interface';

export default (server: Hapi.Server) => (service: IEnrollmentService) => {
  server.route({
    method: 'POST',
    path: '/bff/v1/enrollment/group',
    options: {
      description: 'Enroll in beta groups with invite key',
      tags: ['api', 'enrollment'],
      validate: postEnrollmentGroupRequest,
    },
    handler: async (request) => {
      const query = request.query as unknown as EnrollmentQuery;
      const customerAccountId =
        request.headers['entur-customer-account-id'] || '';

      if (customerAccountId.length < 1) {
        // Either not authenticated, claims not set in JWT, or empty customer
        // account id. Either way, we bail.
        return Boom.badData('Invalid customer account id');
      }

      let enrollmentId = '';

      // NOTE: This is a bit hacky, but it'll do for now. Also note the hardcoded analytics group
      // that is always returned. When the app is changed to show a list of pilots that you can
      // (and have) join(ed), this should be cleaner.
      if (TICKET_INVITE_KEY && TICKET_INVITE_KEY === query.inviteKey) {
        enrollmentId = 'ticket';
      } else if (
        PERIOD_TICKET_INVITE_KEY &&
        PERIOD_TICKET_INVITE_KEY === query.inviteKey
      ) {
        enrollmentId = 'period-ticket';
      } else if (
        FLEX_TICKET_INVITE_KEY &&
        FLEX_TICKET_INVITE_KEY === query.inviteKey
      ) {
        enrollmentId = 'flexible-ticket';
      } else if (SHMO_INVITE_KEY && SHMO_INVITE_KEY === query.inviteKey) {
        enrollmentId = 'shmo';
      } else if (BONUS_INVITE_KEY_A && BONUS_INVITE_KEY_A === query.inviteKey) {
        enrollmentId = 'bonus-pilot-a';
      } else if (BONUS_INVITE_KEY_B && BONUS_INVITE_KEY_B === query.inviteKey) {
        enrollmentId = 'bonus-pilot-b';
      }

      if (enrollmentId.length < 1) {
        // Unknown code
        return Boom.badData('Invalid code');
      }

      const response = await service.enroll(
        customerAccountId,
        enrollmentId,
        query.inviteKey,
      );
      const analyticsGroups = ['ticketing_group'];

      if (response.isErr) {
        return Boom.badData(response.error.message);
      }

      const payload = response.unwrap();

      analyticsGroups.push(payload.analytics_group);

      return {status: 'ok', groups: analyticsGroups};
    },
  });
};
