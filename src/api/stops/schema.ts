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
export const getDeparturesFromQuayRequest = getStopPlaceDeparturesRequest;

export const getNearestDeparturesRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required()
  })
};

export const getStopPlaceQuaysRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  query: Joi.object({
    filterByInUse: Joi.bool().default(false)
  })
};

export const getStopPlacesByNameRequest = {
  query: Joi.object({
    query: Joi.string().required(),
    lat: Joi.number(),
    lon: Joi.number()
  }).and('lat', 'lon')
};

export const getDeparturesForServiceJourneyRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  query: Joi.object({
    date: Joi.date()
  })
};

export const getDeparturesBetweenStopPlacesRequest = {
  query: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required()
  }).required()
};
