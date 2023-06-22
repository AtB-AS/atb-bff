import Joi from 'joi';

export const getHarborsRequest = {
  query: Joi.object({
    authorities: Joi.array().single().items(Joi.string()).required(),
  }),
};

export const getStopPlacesRequest = {
  query: Joi.object({codespace: Joi.string().required()}),
};
