import Joi from 'joi';

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

export const getServiceJourneyPolylinesRequest = {
  params: Joi.object({
    query: Joi.object({
      id: Joi.string().required(),
      fromQuayId: Joi.string(),
      toQuayId: Joi.string()
    })
  })
};
