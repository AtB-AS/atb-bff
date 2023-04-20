import Joi from 'joi';

export const getVehiclesRequest = {
  query: Joi.object({
    serviceJourneyIds: Joi.array().items(Joi.string()).default([]).single()
  })
};

export const getVehicleSubscriptionRequest = {
  query: Joi.object({
    serviceJourneyId: Joi.string()
  })
};
