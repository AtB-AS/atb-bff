import Joi from 'joi';
import {
  DepartureFavoritesPayload,
  DepartureFavoritesQuery,
  DepartureGroupsPayload,
  DepartureGroupsQuery,
  FavoriteDeparture,
} from '../../service/types';

export const getDeparturesCursoredRequest = {
  payload: Joi.object<DepartureGroupsPayload>({
    location: Joi.alt([
      Joi.object({
        layer: 'venue',
        id: Joi.string(),
      }),
      Joi.object({
        layer: 'address',
        coordinates: Joi.object({
          longitude: Joi.number(),
          latitude: Joi.number(),
        }),
      }),
    ])
      .options({stripUnknown: true})
      .required(),
    favorites: Joi.array()
      .single()
      .items(
        Joi.object<FavoriteDeparture>({
          stopId: Joi.string().required(),
          lineName: Joi.string(),
          lineId: Joi.string().required(),
          quayId: Joi.string(),
        }).options({stripUnknown: true}),
      ),
  }),
  query: Joi.object<DepartureGroupsQuery>({
    limitPerLine: Joi.number().default(5),
    startTime: Joi.date().default(() => new Date()),

    // Paging
    pageSize: Joi.number().default(3),
    cursor: Joi.string(),
  }),
};

export const getDepartureFavoritesCursoredRequest = {
  payload: Joi.object<DepartureFavoritesPayload>({
    favorites: Joi.array()
      .single()
      .items(
        Joi.object<FavoriteDeparture>({
          stopId: Joi.string().required(),
          lineName: Joi.string(),
          lineId: Joi.string().required(),
          quayId: Joi.string(),
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
