import Joi from 'joi';

export const getServiceJourneyMapDataRequest = {
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
  query: Joi.object({
    fromQuayId: Joi.string(),
    toQuayId: Joi.string(),
  }),
};

export const getDeparturesForServiceJourneyRequestV2 = {
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
  query: Joi.object({
    date: Joi.date(),
  }),
};

export const getServiceJourneyWithEstimatedCallsV2 = {
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
  query: Joi.object({
    date: Joi.date(),
  }),
};
