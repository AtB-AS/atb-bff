import Joi from 'joi';

export const getDepartureRealtime = {
  query: Joi.object({
    quayIds: Joi.array().items(Joi.string()).default([]).single(),
    lineIds: Joi.array().items(Joi.string()).single(),
    startTime: Joi.date(),
    limit: Joi.number().default(5),
    limitPerLine: Joi.number()
  })
};
