import Joi from 'joi';

export const getStopDeparturesRequest = {
  query: Joi.object({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number(),
    startTime: Joi.string()
  })
};

export const getDepartureRealtime = {
  query: Joi.object({
    quayIds: Joi.array().items(Joi.string()).default([]).single(),
    startTime: Joi.date(),
    limit: Joi.number().default(5)
  })
};
