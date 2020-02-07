import Joi from '@hapi/joi';

export const getNextDeparturesRequest = {
  query: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required()
  }).required()
};
