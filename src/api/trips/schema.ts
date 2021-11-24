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
    when: Joi.date(),
  })
};
