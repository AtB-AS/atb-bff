import Joi from '@hapi/joi';

export const getFeaturesRequest = Joi.object({
  query: Joi.string().required(),
  lon: Joi.number(),
  lat: Joi.number(),
  layers: Joi.string().custom(val => {
    if (val && typeof val === 'string') {
      return val.split(',');
    }
    return val;
  }),
  'boundary.rect.min_lat': Joi.number(),
  'boundary.rect.max_lat': Joi.number(),
  'boundary.rect.min_lon': Joi.number(),
  'boundary.rect.max_lon': Joi.number(),
  country: Joi.string(),
  sources: Joi.string(),
  limit: Joi.number()
})
  .and('lat', 'lon')
  .and(
    'boundary.rect.min_lat',
    'boundary.rect.max_lat',
    'boundary.rect.min_lon',
    'boundary.rect.max_lon'
  );

export const getFeaturesReverseRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    layers: Joi.string(),
    radius: Joi.number(),
    limit: Joi.number()
  })
};
