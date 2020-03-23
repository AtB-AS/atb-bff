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
      name: Joi.string(),
      coordinates: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      })
    }).required(),
    to: Joi.object({
      name: Joi.string(),
      coordinates: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      })
    }).required(),
    searchDate: Joi.date(),
    arriveBy: Joi.bool().default(false),
    modes: Joi.array().default(['foot', 'bus', 'tram']),
    limit: Joi.number().default(5),
    wheelchairAccessible: Joi.bool().default(false)
  }).options({ abortEarly: false })
};
