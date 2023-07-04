import Joi from 'joi';
import {VippsCustomTokenRequest} from '../../service/types';

export const postVippsLoginRequest = {
  payload: Joi.object<VippsCustomTokenRequest>({
    authorizationCode: Joi.string().required(),
    state: Joi.string().required(),
    nonce: Joi.string().required(),
  }).required(),
};
