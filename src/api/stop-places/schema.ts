import Joi from 'joi';
import {
  StopPlaceConnectionsQuery,
  StopPlacesByModeQuery,
} from '../../service/types';

export const getStopPlacesByModeRequest = {
  query: Joi.object<StopPlacesByModeQuery>({
    authorities: Joi.array().single().items(Joi.string()).required(),
    transportModes: Joi.array().single().items(Joi.string()).required(),
    transportSubmodes: Joi.array().single().items(Joi.string()),
  }),
};

export const getStopPlaceConnectionsRequest = {
  query: Joi.object<StopPlaceConnectionsQuery>({
    authorities: Joi.array().single().items(Joi.string()).required(),
    fromStopPlaceId: Joi.string().required(),
    transportModes: Joi.array().single().items(Joi.string()),
    transportSubmodes: Joi.array().single().items(Joi.string()),
  }),
};
