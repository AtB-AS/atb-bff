import Joi from 'joi';

export const getJourneyRequest = {
  query: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    when: Joi.date()
  })
};

export const getSingleTripPattern = {
  query: Joi.object({
    id: Joi.string().required()
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

    minimumTransferTime: Joi.number().default(30),
    modes: Joi.array()
      .single()
      .default(['foot', 'bus', 'tram', 'rail', 'metro', 'water', 'air']),
    limit: Joi.number().default(15),
    // Default in meters. 2000m = 2km. Should be somewhat high
    // for more rural areas.
    maxPreTransitWalkDistance: Joi.number().default(2000),
    // Higher number = lower rating for walking. Default by entur is 4
    walkReluctance: Joi.number().default(5),
    wheelchairAccessible: Joi.bool().default(false)
  }).options({ abortEarly: false })
};
