import Joi from '@hapi/joi';

export const getNextDeparturesRequest = {
  query: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required()
  }).required()
};

export const getNextDepartureBetweenNearestRequest = {
  query: Joi.object({
    to: Joi.string().required(),
    lat: Joi.string().required(),
    lon: Joi.string().required()
  }).required()
};
