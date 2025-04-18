import Joi from 'joi';
import {DeparturesQueryVariables} from '../../service/impl/departures/journey-gql/departures.graphql-gen';
import {StopsDetailsQueryVariables} from '../../service/impl/departures/journey-gql/stops-details.graphql-gen';
import {NearestStopPlacesQueryVariables} from '../../service/impl/departures/journey-gql/stops-nearest.graphql-gen';
import {DeparturesPayload, FavoriteDeparture} from '../../service/types';
import {DestinationDisplay} from '../../graphql/journey/journeyplanner-types_v3';

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

export const postDeparturesRequest = {
  payload: Joi.object<DeparturesPayload>({
    favorites: Joi.array()
      .single()
      .items(
        Joi.object<FavoriteDeparture>({
          lineName: Joi.string().description(
            'deprecated - use destinationDisplay instead',
          ), // kept for backward compatibility
          destinationDisplay: Joi.object<DestinationDisplay>({
            frontText: Joi.string(),
            via: Joi.array().items(Joi.string()).optional().single(),
          }),
          lineId: Joi.string().required(),
          quayId: Joi.string().required(),
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
