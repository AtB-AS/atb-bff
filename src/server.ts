import hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import hapiPulse from 'hapi-pulse';
import hapiSwagger from 'hapi-swagger';
import hapiInert from '@hapi/inert';
import hapiVision from '@hapi/vision';

import hapiApiVersion from 'hapi-api-version';
import Boom from '@hapi/boom';
import EnturService from '@entur/sdk';

import geocoderRoutes from './api/geocoder';

export const createServer = () => {
  const port = process.env['PORT'] || 8080;
  const server = new hapi.Server({
    port,
    host: 'localhost',
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            // In prod, log a limited error message and throw the default Bad Request error.
            console.error('ValidationError:', err?.message);
            throw Boom.badRequest(`Invalid request payload input`);
          } else {
            throw err;
          }
        }
      }
    }
  });

  return server;
};

export const initializePlugins = async (server: hapi.Server) => {
  await server.register({
    plugin: hapiPino,
    options: {
      logEvents:
        process.env['NODE_ENV'] === 'test'
          ? null
          : ['onPostStart', 'onPostStop', 'response', 'request-error'],
      prettyPrint: process.env['NODE_ENV'] !== 'production'
    }
  });
  await server.register([hapiVision, hapiInert, hapiPulse]);
  await server.register({
    plugin: hapiApiVersion,
    options: {
      validVersions: [1, 2],
      defaultVersion: 1,
      vendorName: 'mittatb'
    }
  });
  await server.register({
    plugin: hapiSwagger,
    options: {
      info: {
        title: 'API Documentation',
        description: 'Description goes here',
        version: '1.0.0'
      }
    }
  });

  return server;
};

export const initializeRoutes = (server: hapi.Server) => {
  const enturService = new EnturService({
    clientName: 'atb-mittatb'
  });

  // initJourney(server);
  geocoderRoutes(server)(enturService);
  // initStops(server);
};
