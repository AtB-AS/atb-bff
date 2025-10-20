import Joi from 'joi';
import {
  StopPlaceDistancesQuery,
  StopPlaceParentQuery,
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
  query: Joi.object<StopPlaceDistancesQuery>({
    authorities: Joi.array().single().items(Joi.string()).required(),
    fromStopPlaceId: Joi.string().required(),
    transportModes: Joi.array().single().items(Joi.string()),
    transportSubmodes: Joi.array().single().items(Joi.string()),
    orgId: Joi.string().optional(),
  }),
};

export const getStopPlaceParentRequest = {
  query: Joi.object<StopPlaceParentQuery>({
    id: Joi.string().required(),
  }),
};

export const getDistancesResult = Joi.object().pattern(
  Joi.string(),
  Joi.number(),
);
