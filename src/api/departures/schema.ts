import Joi from 'joi';

export const getStopsNearestRequest = {
  query: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    distance: Joi.number(),
    count: Joi.number(),
    after: Joi.string()
  })
};

export const getStopDeparturesRequest = {
  query: Joi.object({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number(),
    startTime: Joi.string()
  })
};

export const getQuayDeparturesRequest = {
  query: Joi.object({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number(),
    startTime: Joi.string(),
    timeRange: Joi.number()
  })
};

export const getDepartureRealtime = {
  query: Joi.object({
    quayIds: Joi.array().items(Joi.string()).default([]).single(),
    startTime: Joi.date(),
    limit: Joi.number().default(5)
  })
};
