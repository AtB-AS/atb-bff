import http from 'http';

import hapi from '@hapi/hapi';
import hapiPulse from 'hapi-pulse';
import hapiSwagger from 'hapi-swagger';
import hapiInert from '@hapi/inert';
import hapiVision from '@hapi/vision';
import hapiApiVersion from 'hapi-api-version';

import logFmtPlugin from './plugins/logfmt';
import atbHeaders from './plugins/atb-headers';
import appVersionCheckerPlugin from './plugins/app-version-checker-plugin';
import url from 'url';
import Redis from '@hapi/catbox-redis';
import Memory from '@hapi/catbox-memory';
import {REDIS_HOST, REDIS_PORT} from './config/env';
import HAPIPluginWebsocket from 'hapi-plugin-websocket';

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
    cache: [
      REDIS_HOST !== '' && REDIS_PORT !== ''
        ? {
            name: 'redis',
            provider: {
              constructor: Redis,
              options: {
                host: REDIS_HOST,
                port: REDIS_PORT,
                partition: 'bff',
              },
            },
          }
        : {
            name: 'memory',
            provider: {
              constructor: Memory.Engine,
              options: {},
            },
          },
    ],
    routes: {
      cors: true,
      validate: {
        failAction: async (request, h, err) => err,
      },
    },
  });
};

export const initializePlugins = async (server: hapi.Server) => {
  await server.register({plugin: atbHeaders});
  await server.register({plugin: appVersionCheckerPlugin});
  await server.register({
    plugin: logFmtPlugin,
    options: {
      json: true,
      stream: process.env.NODE_ENV === 'test' ? undefined : process.stdout,
      defaultFields: (request) => ({
        time: new Date(request.info.received).toISOString(),
        method: request.method.toUpperCase(),
        url: url.format(request.url, {search: false}),
        requestId: request.requestId,
        installId: request.installId,
        webshopVersion: request.webshopVersion,
        appVersion: request.appVersion,
        correlationId: request.correlationId,
        customerAccountId: request.customerAccountId,
        message: 'handle request',
      }),
    },
  });

  await server.register(hapiVision);
  await server.register(hapiInert);
  await server.register(hapiPulse);
  await server.register({
    plugin: hapiApiVersion,
    options: {
      validVersions: [1],
      defaultVersion: 1,
      vendorName: 'bff-oneclick-planner',
    },
  });
  await server.register({
    plugin: hapiSwagger,
    options: {
      info: {
        title: 'BFF API Documentation',
        description: '[AtB-AS/atb-bff](https://github.com/AtB-AS/atb-bff)',
      },
    },
  });

  await server.register(HAPIPluginWebsocket);

  return server;
};
