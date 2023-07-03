import Joi from 'joi';
import {EnrollmentQuery} from '../../service/types';

export const postEnrollmentGroupRequest = {
  query: Joi.object<EnrollmentQuery>({
    inviteKey: Joi.string().required(),
  }),
};
