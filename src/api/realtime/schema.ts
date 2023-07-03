import Joi from 'joi';
import {DepartureRealtimeQuery} from '../../service/types';

export const getDepartureRealtime = {
  query: Joi.object<DepartureRealtimeQuery>({
    quayIds: Joi.array().items(Joi.string()).default([]).single(),
    startTime: Joi.date(),
    limit: Joi.number().default(5),
    lineIds: Joi.array().items(Joi.string()).single(),
    limitPerLine: Joi.number(),
    timeRange: Joi.number(),
  }),
};
