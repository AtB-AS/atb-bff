import { name, version } from '../package.json';
import { createServer, initializePlugins, initializeRoutes } from './server';

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
  await server.initialize();
  await server.start();

  server
    .logger()
    .info(`${name} (${version}) listening on ${server.settings.port}`);
})();
