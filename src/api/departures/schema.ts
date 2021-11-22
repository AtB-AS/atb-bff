import Joi from 'joi';

export const getStopsNearestRequest = {
  query: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    maximumDistance: Joi.number(),
    maximumResults: Joi.number(),
    filterByInUse: Joi.boolean()
  })
};

export const getStopDeparturesRequest = {
  query: Joi.object({
    filterByInUse: Joi.boolean(),
    id: Joi.string().required(),
    numberOfDepartrues: Joi.number(),
    startTime: Joi.string()
  })
};