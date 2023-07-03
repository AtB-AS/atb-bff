import Joi from 'joi';
import {DeparturesQueryVariables} from '../../service/impl/departures/journey-gql/departures.graphql-gen';
import {StopPlaceQuayDeparturesQueryVariables} from '../../service/impl/departures/journey-gql/stop-departures.graphql-gen';
import {StopsDetailsQueryVariables} from '../../service/impl/departures/journey-gql/stops-details.graphql-gen';
import {NearestStopPlacesQueryVariables} from '../../service/impl/departures/journey-gql/stops-nearest.graphql-gen';
import {
  DeparturesPayload,
  FavoriteDeparture,
  QuayDeparturesQueryVariables,
} from '../../service/types';

export const getStopsNearestRequest = {
  query: Joi.object<NearestStopPlacesQueryVariables>({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    distance: Joi.number().default(1000),
    count: Joi.number().default(10),
    after: Joi.string(),
  }),
};

export const getStopsDetailsRequest = {
  query: Joi.object<StopsDetailsQueryVariables>({
    ids: Joi.array().items(Joi.string()).required().single(),
  }),
};

export const getStopDeparturesRequest = {
  query: Joi.object<StopPlaceQuayDeparturesQueryVariables>({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number().default(5),
    startTime: Joi.string(),
    timeRange: Joi.number(),
    limitPerLine: Joi.number(),
  }),
};

export const postStopDeparturesRequest = {
  payload: Joi.object<DeparturesPayload>({
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
  query: Joi.object<StopPlaceQuayDeparturesQueryVariables>({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number().default(5),
    startTime: Joi.string(),
    timeRange: Joi.number(),
    limitPerLine: Joi.number(),
  }),
};

export const postDeparturesRequest = {
  payload: Joi.object<DeparturesPayload>({
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
  query: Joi.object<DeparturesQueryVariables>({
    ids: Joi.array().single().items(Joi.string()).required(),
    numberOfDepartures: Joi.number().default(1000),
    startTime: Joi.string(),
    timeRange: Joi.number().default(86400),
    limitPerLine: Joi.number(),
  }),
};

export const getQuayDeparturesRequest = {
  query: Joi.object<QuayDeparturesQueryVariables>({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number().default(10),
    startTime: Joi.string(),
    timeRange: Joi.number().default(86400),
    limitPerLine: Joi.number(),
  }),
};

export const postQuayDeparturesRequest = {
  payload: Joi.object<DeparturesPayload>({
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
  query: Joi.object<QuayDeparturesQueryVariables>({
    id: Joi.string().required(),
    numberOfDepartures: Joi.number().default(1000),
    startTime: Joi.string(),
    timeRange: Joi.number().default(86400),
    limitPerLine: Joi.number(),
  }),
};
