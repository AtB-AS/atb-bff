import Joi from '@hapi/joi';

export const getFeaturesRequest = {
  query: Joi.object({
    query: Joi.string().required(),
    lon: Joi.number(),
    lat: Joi.number(),
    layers: Joi.string(),
    bx1: Joi.number(),
    bx2: Joi.number(),
    by1: Joi.number(),
    by2: Joi.number(),
    country: Joi.string(),
    sources: Joi.string(),
    limit: Joi.number()
  })
    .and('lat', 'lon')
    .and('bx1', 'bx2', 'by2', 'by1')
};

export const getFeaturesReverseRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    layers: Joi.string(),
    radius: Joi.number(),
    size: Joi.number()
  })
};
