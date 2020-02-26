import { name, version } from '../package.json';

import { Boom } from '@hapi/boom';

/* Set up tracing if running in production */
if (process.env.NODE_ENV === 'production') {
  console.info('starting tace agent...');
  require('@google-cloud/trace-agent').start();
}

import { Logging } from '@google-cloud/logging';

import { createServer, initializePlugins } from './server';
import enturClient from './service/impl/entur';
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

  const logger = new Logging();
  const enturService = enturClient(logger);

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
})();
