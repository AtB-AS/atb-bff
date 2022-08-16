import Joi from "joi";

export const postVippsLoginRequest = {
    payload: Joi.object({
        authorizationCode: Joi.string().required(),
        state: Joi.string().required(),
        nonce: Joi.string().required()
    }).required()
};
