import { name, version } from '../package.json';

import { Boom } from '@hapi/boom';

import { createServer, initializePlugins } from './server';
import enturService from './service/impl/entur';
import geocoderService from './service/impl/geocoder';
import stopsService from './service/impl/stops';
import journeyService from './service/impl/journey';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';

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

  await server.initialize();
  await server.start();

  server
    .logger()
    .info(`${name} (${version}) listening on ${server.settings.port}`);
})();
