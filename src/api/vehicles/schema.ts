import Joi from 'joi';
import {ServiceJourneyVehicleQueryVariables} from '../../service/types';

export const getVehiclesRequest = {
  query: Joi.object<ServiceJourneyVehicleQueryVariables>({
    serviceJourneyIds: Joi.array().items(Joi.string()).default([]).single(),
  }),
};

export const postServiceJourneySubscriptionRequest = {
  query: Joi.object({
    serviceJourneyId: Joi.string(),
  }),
};
