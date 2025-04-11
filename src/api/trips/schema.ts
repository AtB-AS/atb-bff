import Joi from 'joi';
import {Location, Modes} from '../../graphql/journey/journeyplanner-types_v3';
import {TripsQueryVariables} from '../../service/impl/trips/journey-gql/trip.graphql-gen';
import {
  CompressedSingleTripQuery,
  NonTransitTripsQueryVariables,
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
    transferSlack: Joi.number(),
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

export const postNonTransitTripsRequest = {
  payload: Joi.object<NonTransitTripsQueryVariables>({
    from: Joi.object({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
    }).required(),
    to: Joi.object({
      place: Joi.string().optional(),
      name: Joi.string().default('UNKNOWN'),
      coordinates: Joi.object({
        latitude: Joi.number(),
        longitude: Joi.number(),
      }),
    }).required(),
    arriveBy: Joi.bool().required(),
    when: Joi.date(),
    walkSpeed: Joi.number(),
    directModes: Joi.array().items(Joi.string()).default(['foot', 'bicycle']),
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
