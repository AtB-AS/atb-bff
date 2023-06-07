import Joi from 'joi';
import { FormFactor } from '../../graphql/mobility/mobility-types_v2';

export const getVehiclesRequest = {
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
export const getVehicleRequest = {
  query: Joi.object({
    ids: Joi.array().items(Joi.string()).required().single()
  })
};

export const getStationsRequest = {
  query: Joi.object({
    availableFormFactors: Joi.array()
      .items(Joi.string())
      .optional()
      .default(FormFactor.Bicycle)
      .single(),
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    range: Joi.number().optional().default(500),
    operators: Joi.array().items(Joi.string()).optional().single()
  })
};
export const getCarStationRequest = {
  query: Joi.object({
    ids: Joi.array().items(Joi.string()).required().single()
  })
};
