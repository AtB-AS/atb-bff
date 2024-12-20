import Joi from 'joi';
import {
  DepartureFavoritesPayload,
  DepartureFavoritesQuery,
  FavoriteDeparture,
} from '../../service/types';
import {DestinationDisplay} from '../../graphql/journey/journeyplanner-types_v3';

export const getDepartureFavoritesCursoredRequest = {
  payload: Joi.object<DepartureFavoritesPayload>({
    favorites: Joi.array()
      .required()
      .single()
      .items(
        Joi.object<FavoriteDeparture>({
          lineName: Joi.string().description(
            'deprecated - use destinationDisplay instead',
          ),
          destinationDisplay: Joi.object<DestinationDisplay>({
            frontText: Joi.string(),
            via: Joi.array().items(Joi.string()).optional().single(),
          }),
          lineId: Joi.string().required(),
          quayId: Joi.string().required(),
        })
          .options({stripUnknown: true})
          .required(),
      ),
  }),
  query: Joi.object<DepartureFavoritesQuery>({
    limitPerLine: Joi.number().default(5),
    startTime: Joi.date().default(() => new Date()),
    includeCancelledTrips: Joi.boolean(),

    // Paging
    pageSize: Joi.number().default(3),
    cursor: Joi.string(),
  }),
};
