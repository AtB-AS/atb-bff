import Joi from 'joi';

export const getQuaysCoordinatesRequest = {
  payload: Joi.object({
    ids: Joi.array()
      .single()
      .items(Joi.string().options({stripUnknown: true}).required()),
  }),
};
