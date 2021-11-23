import Joi from 'joi';

export const getTripsRequest = {
  query: Joi.object({
    from: Joi.object().required(),
    to: Joi.object().required(),
    when: Joi.date(),
  })
};

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
    searchDate: Joi.date(),
  })
}
