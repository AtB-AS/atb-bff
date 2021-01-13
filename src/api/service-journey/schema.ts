import Joi from '@hapi/joi';

export const getServiceJoruneyMapDataRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  query: Joi.object({
    currentQuayId: Joi.string()
  })
};
