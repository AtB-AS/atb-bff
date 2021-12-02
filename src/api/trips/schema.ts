import Joi from 'joi';

export const postTripsRequest = {
  payload: Joi.object({
    from: Joi.object({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
      })
    }).required(),
    to: Joi.object({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number()
      })
    }).required(),
    when: Joi.date()
  })
};

export const postEncodedSingleTripRequest = {
  payload: Joi.object({
    compressedQuery: Joi.string().required()
  }).required()
}

export const postSingleTripRequest = {
  payload: Joi.object({
    query: Joi.object(
      {
        from: Joi.object({
          place: Joi.string().optional(),
          name: Joi.string().default('UNKNOWN'),
          coordinates: Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number()
          })
        }).required(),
        to: Joi.object({
          place: Joi.string().optional(),
          name: Joi.string().default('UNKNOWN'),
          coordinates: Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number()
          })
        }).required(),
        when: Joi.date(),
      }
    ),
    journeyIds: Joi.array().items(Joi.string()).default([]).single()
  })
};

/*
export type TripsQueryWithJourneyIds = {
  query: TripsQueryVariables,
  journeyIds: string[],
}
 */