import Joi from 'joi';

export const getDepartureFavoritesCursoredRequest = {
  payload: Joi.object({
    favorites: Joi.array()
      .single()
      .items(
        Joi.object({
          stopId: Joi.string().required(),
          lineName: Joi.string(),
          lineId: Joi.string().required(),
          quayId: Joi.string()
        })
          .options({ stripUnknown: true })
          .required()
      )
  }),
  query: Joi.object({
    limitPerLine: Joi.number().default(5),
    startTime: Joi.date().default(() => new Date()),

    // Paging
    pageSize: Joi.number().default(3),
    cursor: Joi.string()
  })
};
