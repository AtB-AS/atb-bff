import { name, version } from '../package.json';

import { Boom } from '@hapi/boom';
import traceAgent from '@google-cloud/trace-agent';

import { createServer, initializePlugins } from './server';
import enturService from './service/impl/entur';
import geocoderService from './service/impl/geocoder';
import stopsService from './service/impl/stops';
import journeyService from './service/impl/journey';
import agentService from './service/impl/agent';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';
import agentRoutes from './api/agent';

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

(async () => {
  const server = createServer({
    port: process.env['PORT'] || '8080'
  });

  await initializePlugins(server);
  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) =>
      new Boom('The requested resource was not found.', { statusCode: 404 })
  });
  stopsRoutes(server)(stopsService(enturService));
  geocoderRoutes(server)(geocoderService(enturService));
  journeyRoutes(server)(journeyService(enturService));
  agentRoutes(server)(
    agentService(stopsService(enturService), journeyService(enturService))
  );

  await server.initialize();
  await server.start();

  server
    .logger()
    .info(`${name} (${version}) listening on ${server.settings.port}`);

  /* Set up tracing if running on Google Cloud */
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.GOOGLE_CLOUD_PROJECT
  ) {
    server.logger().info(`running on google cloud, starting trace agent`);
    traceAgent.start();
  }
})();
