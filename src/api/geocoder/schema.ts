import Joi from 'joi';
import {FeaturesQuery, ReverseFeaturesQuery} from '../../service/types';

export const getFeaturesRequest = Joi.object<FeaturesQuery>({
  query: Joi.string().required(),
  lon: Joi.number(),
  lat: Joi.number(),
  layers: Joi.array().items(Joi.alt('address', 'venue')).single(),
  multiModal: Joi.alt('parent', 'child', 'all').default('child'),
  tariff_zone_authorities: Joi.array().items(Joi.string()).single(),
  limit: Joi.number(),
}).and('lat', 'lon');

export const getFeaturesReverseRequest = {
  query: Joi.object<ReverseFeaturesQuery>({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    layers: Joi.array().items(Joi.alt('address', 'venue')).single(),
    limit: Joi.number(),
  }),
};
