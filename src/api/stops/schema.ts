import Joi from '@hapi/joi';

export const getStopPlaceRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required()
};

export const getStopPlaceByPositionRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    distance: Joi.number()
  })
};

export const getStopPlaceDeparturesRequest = {
  params: Joi.object({
    id: Joi.string()
  }).required(),
  query: Joi.object({
    start: Joi.date(),
    timeRange: Joi.number(),
    limit: Joi.number(),
    includeNonBoarding: Joi.bool()
  })
};
