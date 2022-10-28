import Joi from 'joi';
import { DepartureGroupsQuery } from '../../service/types';

const ONE_MINUTE = 60 * 1000;

export const getStopPlaceRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required()
};

export const getStopPlaceByPositionRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    distance: Joi.number(),
    includeUnusedQuays: Joi.boolean()
  })
};
export const getStopPlaceDeparturesRequest = {
  params: Joi.object({
    id: Joi.string()
  }).required(),
  query: Joi.object({
    start: Joi.date(),
    timeRange: Joi.number(),
    limit: Joi.number(),
    includeNonBoarding: Joi.bool()
  })
};

export const getDeparturesRequest = {
  payload: Joi.object({
    layer: Joi.string(),
    id: Joi.string(),
    coordinates: Joi.object({ longitude: Joi.number(), latitude: Joi.number() })
  }).options({ allowUnknown: true }),

  query: Joi.object({
    limit: Joi.number().default(5),
    includeNonBoarding: Joi.bool().default(false),
    offset: Joi.number().default(ONE_MINUTE),
    walkSpeed: Joi.number().default(1.3)
  })
};

// @deprecated Should be removed
export const getDeparturesPagingRequest = {
  payload: Joi.object({
    layer: Joi.string(),
    id: Joi.string(),
    coordinates: Joi.object({ longitude: Joi.number(), latitude: Joi.number() })
  }).options({ allowUnknown: true }),

  query: Joi.object({
    limit: Joi.number().default(5),
    startTime: Joi.date().default(() => new Date()),

    // Paging
    pageSize: Joi.number().default(10),
    pageOffset: Joi.number().default(0),

    // Deprecated fields
    offset: Joi.number().default(ONE_MINUTE).description('Deprecated'),
    walkSpeed: Joi.number().default(1.3).description('Deprecated')
  })
};

export const getDeparturesCursoredRequest = {
  payload: Joi.object({
    location: Joi.alt([
      Joi.object({
        layer: 'venue',
        id: Joi.string()
      }),
      Joi.object({
        layer: 'address',
        coordinates: Joi.object({
          longitude: Joi.number(),
          latitude: Joi.number()
        })
      })
    ])
      .options({ stripUnknown: true })
      .required(),
    favorites: Joi.array()
      .single()
      .items(
        Joi.object({
          stopId: Joi.string().required(),
          lineName: Joi.string(),
          lineId: Joi.string().required(),
          quayId: Joi.string()
        }).options({ stripUnknown: true })
      )
  }),
  query: Joi.object<DepartureGroupsQuery>({
    limitPerLine: Joi.number().default(5),
    startTime: Joi.date().default(() => new Date()),

    // Paging
    pageSize: Joi.number().default(3),
    cursor: Joi.string()
  })
};

export const getDepartureRealtime = {
  query: Joi.object({
    quayIds: Joi.array().items(Joi.string()).default([]).single(),
    startTime: Joi.date(),
    limit: Joi.number().default(5)
  })
};

export const getDeparturesFromQuayRequest = getStopPlaceDeparturesRequest;

export const getNearestDeparturesRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    offset: Joi.number().default(ONE_MINUTE),
    walkSpeed: Joi.number().default(1.3),
    includeIrrelevant: Joi.bool().default(false)
  })
};

export const getStopPlaceQuaysRequest = {
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  query: Joi.object({
    filterByInUse: Joi.bool().default(false)
  })
};

export const getStopPlacesByNameRequest = {
  query: Joi.object({
    query: Joi.string().required(),
    lat: Joi.number(),
    lon: Joi.number()
  }).and('lat', 'lon')
};

export const getDeparturesBetweenStopPlacesRequest = {
  query: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required()
  }).required()
};
