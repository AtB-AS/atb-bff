import Joi from 'joi';
import {
  DeparturesForServiceJourneyQuery,
  ServiceJourneyMapInfoQuery,
  ServiceJourneyWithEstimatedCallsQuery,
} from '../../service/types';

export const getServiceJourneyMapDataRequest = {
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
  query: Joi.object<ServiceJourneyMapInfoQuery>({
    fromQuayId: Joi.string(),
    toQuayId: Joi.string(),
  }),
};

export const getDeparturesForServiceJourneyRequestV2 = {
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
  query: Joi.object<DeparturesForServiceJourneyQuery>({
    date: Joi.date(),
  }),
};

export const getServiceJourneyWithEstimatedCallsV2 = {
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
  query: Joi.object<ServiceJourneyWithEstimatedCallsQuery>({
    date: Joi.date(),
  }),
};
