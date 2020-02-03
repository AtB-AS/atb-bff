import http from 'http';

import hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import hapiPulse from 'hapi-pulse';
import hapiSwagger from 'hapi-swagger';
import hapiInert from '@hapi/inert';
import hapiVision from '@hapi/vision';
import hapiApiVersion from 'hapi-api-version';
import Boom from '@hapi/boom';

import enturService from './service/impl/entur';
import geocoderService from './service/impl/geocoder';
import stopsService from './service/impl/stops';
import journeyService from './service/impl/journey';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';

interface ServerOptions {
  port: string;
  listener?: http.Server;
}

export const createServer = (opts: ServerOptions) => {
  const server = new hapi.Server({
    host: 'localhost',
    listener: opts.listener,
    port: opts.port,
    address: '0.0.0.0',
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
      validVersions: [1],
      defaultVersion: 1,
      vendorName: 'mitt∂atb'
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
  stopsRoutes(server)(stopsService(enturService));
  geocoderRoutes(server)(geocoderService(enturService));
  journeyRoutes(server)(journeyService(enturService));
};
