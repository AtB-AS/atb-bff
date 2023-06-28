import Joi from 'joi';

export const getStopPlacesByModeRequest = {
  query: Joi.object({
    authorities: Joi.array().single().items(Joi.string()).required(),
    transportModes: Joi.array().single().items(Joi.string()).required(),
    transportSubmodes: Joi.array().single().items(Joi.string()),
  }),
};

export const getStopPlaceConnectionsRequest = {
  query: Joi.object({
    authorities: Joi.array().single().items(Joi.string()).required(),
    fromStopPlaceId: Joi.string().required(),
  }),
};
