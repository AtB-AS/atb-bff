import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

import { JourneyController } from './controller';
import { container } from 'tsyringe';

const allowedTransportModes = [
  'air',
  'bicycle',
  'bus',
  'cableway',
  'car',
  'car_dropoff',
  'car_park',
  'car_pickup',
  'coach',
  'foot',
  'funicular',
  'lift',
  'metro',
  'rail',
  'tram',
  'transit',
  'water'
];

export default function(server: Hapi.Server) {
  const journeyController = container.resolve(JourneyController);
  server.bind(journeyController);

  server.route({
    method: 'GET',
    path: '/v1/journey/trip',
    handler: journeyController.findTrip,
    options: {
      validate: {
        query: Joi.object({
          from: Joi.string().required(),
          to: Joi.string().required(),
          searchDate: Joi.date().default(new Date())
        })
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/v1/journey/trip',
    handler: journeyController.getTripPatterns,
    options: {
      validate: {
        payload: Joi.object({
          from: Joi.object({
            name: Joi.string(),
            coordinates: Joi.object({
              latitude: Joi.number().required(),
              longitude: Joi.number().required()
            })
          }).required(),
          to: Joi.object({
            name: Joi.string(),
            coordinates: Joi.object({
              latitude: Joi.number().required(),
              longitude: Joi.number().required()
            })
          }).required(),
          searchDate: Joi.date().default(new Date()),
          arriveBy: Joi.bool().default(false),
          modes: Joi.array()
            .items(...allowedTransportModes)
            .default(['foot', 'bus']),
          limit: Joi.number().default(5),
          wheelchairAccessible: Joi.bool().default(false)
        }).options({ abortEarly: false })
      }
    }
  });
}
