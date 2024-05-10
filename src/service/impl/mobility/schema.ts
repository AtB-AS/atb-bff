import Joi from 'joi';
import {
  ViolationsReportingInitQueryResult,
  ViolationsVehicleLookupQueryResult,
} from '../../types';

export const violationsReportingInitQueryResultSchema =
  Joi.object<ViolationsReportingInitQueryResult>({
    providers: Joi.array().items(
      Joi.object({
        id: Joi.number(),
        name: Joi.string(),
        image: Joi.object({
          type: Joi.string(),
          base64: Joi.string(),
        }).allow(null),
      }),
    ),
    violations: Joi.array().items(
      Joi.object({
        id: Joi.number(),
        code: Joi.string(),
        icon: Joi.string(),
        selectable: Joi.boolean(),
      }),
    ),
  });

export const violationsVehicleLookupResultSchema =
  Joi.object<ViolationsVehicleLookupQueryResult>({
    provider_id: Joi.number(),
    vehicle_id: Joi.string(),
  });
