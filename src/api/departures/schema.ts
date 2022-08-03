import Joi from 'joi';

export const getStopsNearestRequest = {
  query: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    distance: Joi.number().default(1000),
    count: Joi.number().default(10),
    after: Joi.string()
  })
};

export const getStopsDetailsRequest = {
  query: Joi.object({
    ids: Joi.array().items(Joi.string()).required().single()
  })
};

export const getStopDeparturesRequest = {
  query: Joi.object({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number().default(5),
    startTime: Joi.string(),
    timeRange: Joi.number()
  })
};

export const postStopDeparturesRequest = {
  payload: Joi.object({
    favorites: Joi.array()
      .single()
      .items(
        Joi.object({
          stopId: Joi.string().required(),
          lineName: Joi.string(),
          lineId: Joi.string().required(),
          quayId: Joi.string()
        }).options({ stripUnknown: true })
      )
  }),
  query: Joi.object({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number().default(5),
    startTime: Joi.string(),
    timeRange: Joi.number()
  })
};

export const getQuayDeparturesRequest = {
  query: Joi.object({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number().default(10),
    startTime: Joi.string(),
    timeRange: Joi.number().default(86400)
  })
};

export const getDepartureRealtime = {
  query: Joi.object({
    quayIds: Joi.array().items(Joi.string()).default([]).single(),
    startTime: Joi.date(),
    limit: Joi.number().default(5)
  })
};
