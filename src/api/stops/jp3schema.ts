import Joi from 'joi';

const ONE_MINUTE = 60 * 1000;

export const getStopPlaceByPositionRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    distance: Joi.number(),
    includeUnusedQuays: Joi.boolean()
  })
};

export const getStopPlaceQuayDeparturesRequest = {
  query: Joi.object({
    filterByInUse: Joi.boolean(),
    id: Joi.string().required(),
    numberOfDepartrues: Joi.number(),
    startTime: Joi.string()
  })
};
