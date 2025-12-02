import Joi from 'joi';
import {VehicleUpdateQueryVariables} from '../../service/types';

export const getVehiclesRequest = {
  query: Joi.object<VehicleUpdateQueryVariables>({
    serviceJourneyIds: Joi.array().items(Joi.string()).default([]).single(),
  }),
};

export const postServiceJourneySubscriptionRequest = {
  query: Joi.object({
    serviceJourneyId: Joi.string(),
  }),
};
