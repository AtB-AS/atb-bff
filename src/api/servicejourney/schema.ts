import Joi from '@hapi/joi';

export const getServiceJoruneyMapDataRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  query: Joi.object({
    fromQuayId: Joi.string(),
    toQuayId: Joi.string()
  })
};

export const getDeparturesForServiceJourneyRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  query: Joi.object({
    date: Joi.date()
  })
};
