import Joi from 'joi';
import {FeaturesV3Query, ReverseFeaturesV3Query} from '../../service/types';

const v3Layers = [
  'stopPlace',
  'address',
  'street',
  'groupOfStopPlaces',
  'poi',
  'place',
] as const;

export const getFeaturesV3Request = Joi.object<FeaturesV3Query>({
  query: Joi.string().required(),
  lon: Joi.number(),
  lat: Joi.number(),
  lang: Joi.string(),
  layers: Joi.array()
    .items(Joi.string().valid(...v3Layers))
    .single(),
  multimodal: Joi.string().valid('parent', 'child', 'all').default('child'),
  fareZoneAuthorities: Joi.array().items(Joi.string()).single(),
  limit: Joi.number(),
}).and('lat', 'lon');

export const getFeaturesReverseV3Request = Joi.object<ReverseFeaturesV3Query>({
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  radius: Joi.number(),
  lang: Joi.string(),
  layers: Joi.array()
    .items(Joi.string().valid(...v3Layers))
    .single(),
  limit: Joi.number(),
});
