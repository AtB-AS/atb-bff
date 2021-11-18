import Joi from 'joi';

export const getStopPlaceByPositionRequest = {
  query: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    maximumDistance: Joi.number(),
    maximumResults: Joi.number(),
    filterByInUse: Joi.boolean()
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
