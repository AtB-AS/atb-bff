import Joi from 'joi';
import {ViolationsReportingInitQueryResult} from '../../types';

export const violationsReportingInitQueryResultSchema =
  Joi.object<ViolationsReportingInitQueryResult>({
    providers: Joi.array().items(
      Joi.object({
        id: Joi.number(),
        name: Joi.string(),
      }),
    ),
    violations: Joi.array().items(
      Joi.object({
        id: Joi.number(),
        code: Joi.string(),
      }),
    ),
  });
