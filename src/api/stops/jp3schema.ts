import Joi from 'joi';
import { DepartureGroupsQuery } from '../../service/types';

const ONE_MINUTE = 60 * 1000;

export const getStopPlaceByPositionRequest = {
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
    distance: Joi.number(),
    includeUnusedQuays: Joi.boolean()
  })
};
