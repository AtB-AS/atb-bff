import http from 'http';

import hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import hapiPulse from 'hapi-pulse';
import hapiSwagger from 'hapi-swagger';
import hapiInert from '@hapi/inert';
import hapiVision from '@hapi/vision';
import hapiApiVersion from 'hapi-api-version';

import stackdriverLabel from './plugins/stackdriver-label';

interface ServerOptions {
  port: string;
  listener?: http.Server;
}

export const createServer = (opts: ServerOptions) => {
  return new hapi.Server({
    host: 'localhost',
    listener: opts.listener,
    port: opts.port,
    address: '0.0.0.0',
    routes: {
      validate: {
        failAction: async (request, h, err) => err
      }
    }
  });
};

export const initializePlugins = async (server: hapi.Server) => {
  await server.register({
    plugin: stackdriverLabel,
    options: {
      headers: ['Atb-Install-Id']
    }
  });
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
      vendorName: 'bff-oneclick-planner'
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
