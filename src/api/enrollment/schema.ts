import Joi from 'joi';

export const postEnrollmentGroupRequest = {
  query: Joi.object({
    inviteKey: Joi.string().required()
  })
};
