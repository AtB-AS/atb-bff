import Joi from 'joi';
import {Location, Modes} from '../../graphql/journey/journeyplanner-types_v3';
import {TripsQueryVariables} from '../../service/impl/trips/journey-gql/trip.graphql-gen';
import {
  BookingTripsQueryParameters,
  BookingTripsQueryPayload,
  CompressedSingleTripQuery,
  NonTransitTripsQueryVariables,
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
    includeCancellations: Joi.bool().optional(),
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

export const postBookingTripsRequest = {
  query: Joi.object<BookingTripsQueryParameters>({
    searchTime: Joi.string().required(),
    fromStopPlaceId: Joi.string().required(),
    toStopPlaceId: Joi.string().required(),
  }),
  payload: Joi.object<BookingTripsQueryPayload>({
    travellers: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        userType: Joi.string().required(),
        count: Joi.number().required(),
        productIds: Joi.array().items(Joi.string()),
      }),
    ),
    products: Joi.array().items(Joi.string()).required(),
    supplementProducts: Joi.array().items(Joi.string()),
  }),
};

export const postEncodedSingleTripRequest = {
  payload: Joi.object<CompressedSingleTripQuery>({
    compressedQuery: Joi.string().required(),
  }).required(),
};

// Only validates the fields the BFF reads; everything else passes through.
const legStubSchema = Joi.object({
  id: Joi.string().optional().allow(null),
  mode: Joi.string().required(),
  distance: Joi.number().required(),
  duration: Joi.number().required(),
  aimedStartTime: Joi.string().required(),
  aimedEndTime: Joi.string().required(),
  expectedStartTime: Joi.string().required(),
  expectedEndTime: Joi.string().required(),
  fromPlace: Joi.object().required(),
  toPlace: Joi.object().required(),
}).options({allowUnknown: true});

export const postSingleTripV3Request = {
  payload: Joi.object({
    legs: Joi.array().items(legStubSchema).min(1).required(),
  })
    .options({allowUnknown: true})
    .required(),
};
