import { Boom } from '@hapi/boom';
import { GoogleAuth } from 'google-auth-library';
/* Set up tracing if running in production */
if (process.env.NODE_ENV === 'production') {
  console.info('starting tace agent...');
  require('@google-cloud/trace-agent').start();
}

import { createServer, initializePlugins } from './server';
import enturClient from './service/impl/entur';
import stopsService from './service/impl/stops';
import journeyService from './service/impl/journey';

import { getFeatures, getFeaturesReverse } from './api/geocoder';
import createGeocoderService from './lib/services/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';
import healthRoutes from './api/health';

import registerMetricsExporter from './utils/metrics';

import { GaxiosError } from 'gaxios';
import { PubSub } from '@google-cloud/pubsub';

process.on('unhandledRejection', err => {
  console.error(err);
  /* Ignore errors from the Stackdriver Reporter for now */
  if (err instanceof GaxiosError) return;

  process.exit(-1);
});

(async () => {
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const projectId = await auth.getProjectId();

    const server = createServer({
      port: process.env['PORT'] || '8080'
    });
    const enturService = enturClient({});
    await initializePlugins(server);
    server.route({
      method: '*',
      path: '/{any*}',
      handler: (request, h) =>
        new Boom('The requested resource was not found.', { statusCode: 404 })
    });

    const pubSubClient = new PubSub({ projectId: 'atb-mobility-platform' });
    const js = journeyService(enturService, pubSubClient);
    await server.register(createGeocoderService(enturService));
    await server.register([getFeatures, getFeaturesReverse], {
      routes: {
        prefix: '/bff'
      }
    });

    healthRoutes(server);
    stopsRoutes(server)(stopsService(enturService));
    journeyRoutes(server)(js);

    registerMetricsExporter(projectId);
    await server.initialize();
    await server.start();
  } catch (error) {
    console.error(
      `failed to initialize server: ${error?.message}, terminating process.`
    );
    process.exit(-1);
  }
})();
