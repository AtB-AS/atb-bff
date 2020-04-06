import Joi from '@hapi/joi';

export const getJourneyRequest = {
  query: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    when: Joi.date()
  })
};

export const postJourneyRequest = {
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
    searchDate: Joi.date(),
    arriveBy: Joi.bool().default(false),

    modes: Joi.array().default([
      'foot',
      'bus',
      'tram',
      'rail',
      'metro',
      'water',
      'air'
    ]),
    limit: Joi.number().default(5),
    wheelchairAccessible: Joi.bool().default(false)
  }).options({ abortEarly: false })
};
