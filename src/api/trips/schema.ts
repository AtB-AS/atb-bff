import Joi from 'joi';
import {Location, Modes} from '../../graphql/journey/journeyplanner-types_v3';
import {TripsQueryVariables} from '../../service/impl/trips/journey-gql/trip.graphql-gen';
import {TripPatternsQuery} from '../../service/types';
import {
  CompressedSingleTripQuery,
  TripsQueryWithJourneyIds,
} from '../../types/trips';

export const postTripsRequest = {
  payload: Joi.object<TripsQueryVariables>({
    from: Joi.object<Location>({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
    }).required(),
    to: Joi.object<Location>({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
    }).required(),
    arriveBy: Joi.bool().required(),
    when: Joi.date(),
    cursor: Joi.string(),
    transferPenalty: Joi.number(),
    waitReluctance: Joi.number(),
    walkReluctance: Joi.number(),
    walkSpeed: Joi.number(),
    modes: Joi.object<Modes>({
      accessMode: Joi.string(),
      directMode: Joi.string(),
      egressMode: Joi.string(),
      transportModes: Joi.array().items(
        Joi.object({
          transportMode: Joi.string(),
          transportSubModes: Joi.array().items(Joi.string()),
        }),
      ),
    }).optional(),
  }),
};

export const postEncodedSingleTripRequest = {
  payload: Joi.object<CompressedSingleTripQuery>({
    compressedQuery: Joi.string().required(),
  }).required(),
};

export const postSingleTripRequest = {
  payload: Joi.object<TripsQueryWithJourneyIds>({
    query: Joi.object({
      from: Joi.object<Location>({
        place: Joi.string().optional(),
        name: Joi.string().default('UNKNOWN'),
        coordinates: Joi.object({
          latitude: Joi.number(),
          longitude: Joi.number(),
        }),
      }).required(),
      to: Joi.object<Location>({
        place: Joi.string().optional(),
        name: Joi.string().default('UNKNOWN'),
        coordinates: Joi.object({
          latitude: Joi.number(),
          longitude: Joi.number(),
        }),
      }).required(),
      when: Joi.date(),
    }),
    journeyIds: Joi.array().items(Joi.string()).default([]).single(),
  }),
};

export const postJourneyRequest = {
  payload: Joi.object<TripPatternsQuery>({
    from: Joi.object<Location>({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
    }).required(),
    to: Joi.object<Location>({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
    }).required(),
    searchDate: Joi.date(),
    arriveBy: Joi.bool().default(false),

    minimumTransferTime: Joi.number().default(30),
    modes: Joi.array()
      .single()
      .default(['foot', 'bus', 'tram', 'rail', 'metro', 'water', 'air']),
    limit: Joi.number().default(15),
    // Default in meters. 2000m = 2km. Should be somewhat high
    // for more rural areas.
    maxPreTransitWalkDistance: Joi.number().default(2000),
    // Max meters walking on transfers. Defaults to 2000 by Entur.
    maxTransferWalkDistance: Joi.number().default(2000),
    // Higher number = lower rating for walking. Default by entur is 4
    walkReluctance: Joi.number().default(5),
    wheelchairAccessible: Joi.bool().default(false),
  }).options({abortEarly: false}),
};
