import Joi from '@hapi/joi';

export const postEnrollmentGroupRequest = {
  query: Joi.object({
    inviteKey: Joi.string().required()
  })
};
