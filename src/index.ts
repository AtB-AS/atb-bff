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
import departuresService from './service/impl/departures';
import tripsService from './service/impl/trips';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';
import healthRoutes from './api/health';
import enrollmentRoutes from './api/enrollment';
import tripsRoutes from './api/trips';
import departureRoutes from './api/departures';

import registerMetricsExporter from './utils/metrics';

import { GaxiosError } from 'gaxios';
import { PubSub } from '@google-cloud/pubsub';
import serviceJourneyRoutes, {serviceJourneyRoutes_v2} from './api/servicejourney';
import serviceJourneyService, {serviceJourneyService_v2} from './service/impl/service-journey';
import vippsLoginRoutes from "./api/vipps-login";

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

    // JP3
    tripsRoutes(server)(tripsService(enturService_v3, pubSubClient));
    departureRoutes(server)(departuresService(enturService_v3, pubSubClient));
    serviceJourneyRoutes_v2(server)(serviceJourneyService_v2())
    vippsLoginRoutes(server)()

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
