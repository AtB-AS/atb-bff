import Joi from 'joi';
import {
  StopPlaceConnectionsQuery,
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
  query: Joi.object<StopPlaceConnectionsQuery>({
    authorities: Joi.array().single().items(Joi.string()).required(),
    fromStopPlaceId: Joi.string().required(),
    transportModes: Joi.array().single().items(Joi.string()),
    transportSubmodes: Joi.array().single().items(Joi.string()),
  }),
};

export const getStopPlaceParentRequest = {
  query: Joi.object<StopPlaceParentQuery>({
    id: Joi.string().required(),
  }),
};

const getDistancesVersion = Joi.object({
  distance: Joi.number().required(),
  isPricingPath: Joi.boolean().required(),
  validityPeriod: Joi.object({
    from: Joi.date().required(),
    to: Joi.date(),
  }),
});

export const getDistancesResult = Joi.object({
  id: Joi.string().required(),
  fromStopPlaceId: Joi.string().required(),
  toStopPlaceId: Joi.string().required(),
  organisationId: Joi.number().required(),
  versions: Joi.array().single().items(getDistancesVersion),
});
