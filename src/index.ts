import { name, version } from '../package.json';
import { createServer, initializePlugins, initializeRoutes } from './server';
import { Boom } from '@hapi/boom';

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

(async () => {
  const server = createServer({
    port: process.env['PORT'] || '8080'
  });

  await initializePlugins(server);
  await initializeRoutes(server);
  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) =>
      new Boom('The requested resource was not found.', { statusCode: 404 })
  });
  await server.initialize();
  await server.start();

  server
    .logger()
    .info(`${name} (${version}) listening on ${server.settings.port}`);
})();
