import Joi from 'joi';
import {QuaysCoordinatesPayload} from '../../service/types';

export const getQuaysCoordinatesRequest = {
  payload: Joi.object<QuaysCoordinatesPayload>({
    ids: Joi.array()
      .single()
      .items(Joi.string().options({stripUnknown: true}).required()),
  }),
};
