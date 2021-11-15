import { Boom } from '@hapi/boom';
import { GoogleAuth } from 'google-auth-library';
/* Set up tracing if running in production */
if (process.env.NODE_ENV === 'production') {
  console.info('starting trace agent...');
  require('@google-cloud/trace-agent').start();
}

import { createServer, initializePlugins } from './server';
import enturClient from './service/impl/entur';
import { enturClient_v3 } from './service/impl/entur';

import geocoderService from './service/impl/geocoder';
import stopsService from './service/impl/stops';
import journeyService from './service/impl/journey';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';
import healthRoutes from './api/health';
import enrollmentRoutes from './api/enrollment';

import tripsRoutes from './api/trips'
import tripsService from './service/impl/trips'

import registerMetricsExporter from './utils/metrics';

import { GaxiosError } from 'gaxios';
import { PubSub } from '@google-cloud/pubsub';
import serviceJourneyRoutes from './api/servicejourney';
import serviceJourneyService from './service/impl/service-journey';

process.on('unhandledRejection', err => {
  console.error(err);
  /* Ignore errors from the Stackdriver Reporter for now */
  if (err instanceof GaxiosError) return;

  process.exit(-1);
});

(async () => {
  try {
    console.info('⏳ Starting server...');

    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const projectId = await auth.getProjectId();

    const port = process.env['PORT'] || '8080';
    const server = createServer({
      port: port
    });
    const enturService = enturClient();
    const enturService_v3 = enturClient_v3();
    await initializePlugins(server);
    server.route({
      method: '*',
      path: '/{any*}',
      handler: (request, h) =>
        new Boom('The requested resource was not found.', { statusCode: 404 })
    });

    const pubSubClient = new PubSub({ projectId });
    const js = journeyService(enturService, pubSubClient);
    healthRoutes(server);
    stopsRoutes(server)(stopsService(enturService, pubSubClient));
    geocoderRoutes(server)(geocoderService(enturService, pubSubClient));
    journeyRoutes(server)(js);
    serviceJourneyRoutes(server)(serviceJourneyService(enturService));
    enrollmentRoutes(server)();

    tripsRoutes(server)(tripsService(enturService_v3, pubSubClient));

    registerMetricsExporter(projectId);
    await server.initialize();
    await server.start();

    console.info('✅ Server started at http://localhost:' + port);
  } catch (error) {
    console.error(
      `failed to initialize server: ${error?.message}, terminating process.`
    );
    process.exit(-1);
  }
})();
