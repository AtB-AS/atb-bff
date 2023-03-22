import Joi from 'joi';
import { FormFactor } from '../../graphql/mobility/mobility-types_v2';

export const getScootersRequest = {
  query: Joi.object({
    formFactors: Joi.array()
      .items(Joi.string())
      .optional()
      .default(FormFactor.Scooter)
      .single(),
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    range: Joi.number().optional(),
    operators: Joi.array().items(Joi.string()).optional().single()
  })
};
