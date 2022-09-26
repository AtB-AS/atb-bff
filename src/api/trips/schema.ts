import Joi from 'joi';

export const postTripsRequest = {
  payload: Joi.object({
    from: Joi.object({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
      })
    }).required(),
    to: Joi.object({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
      })
    }).required(),
    arriveBy: Joi.bool().required(),
    when: Joi.date(),
    cursor: Joi.string(),
    transferPenalty: Joi.number(),
    waitReluctance: Joi.number(),
    walkReluctance: Joi.number(),
    walkSpeed: Joi.number(),
    modes: Joi.object({
      directMode: Joi.string()
    })
  })
};

export const postEncodedSingleTripRequest = {
  payload: Joi.object({
    compressedQuery: Joi.string().required()
  }).required()
};

export const postSingleTripRequest = {
  payload: Joi.object({
    query: Joi.object({
      from: Joi.object({
        place: Joi.string().optional(),
        name: Joi.string().default('UNKNOWN'),
        coordinates: Joi.object({
          latitude: Joi.number(),
          longitude: Joi.number()
        })
      }).required(),
      to: Joi.object({
        place: Joi.string().optional(),
        name: Joi.string().default('UNKNOWN'),
        coordinates: Joi.object({
          latitude: Joi.number(),
          longitude: Joi.number()
        })
      }).required(),
      when: Joi.date()
    }),
    journeyIds: Joi.array().items(Joi.string()).default([]).single()
  })
};
