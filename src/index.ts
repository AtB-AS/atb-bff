import { Boom } from '@hapi/boom';
import { GoogleAuth } from 'google-auth-library';
/* Set up tracing if running in production */
if (process.env.NODE_ENV === 'production') {
  console.info('starting tace agent...');
  require('@google-cloud/trace-agent').start();
}

import { createServer, initializePlugins } from './server';
import enturClient from './service/impl/entur';
import geocoderService from './service/impl/geocoder';
import stopsService from './service/impl/stops';
import journeyService from './service/impl/journey';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import journeyRoutes from './api/journey';
import healthRoutes from './api/health';
import enrollmentRoutes from './api/enrollment';

import registerMetricsExporter from './utils/metrics';

import { GaxiosError } from 'gaxios';
import { PubSub } from '@google-cloud/pubsub';
import serviceJourneyRoutes from './api/servicejourney';
import serviceJourneyService from './service/impl/service-journey';
import createPublisher from './analytics/publisher';
import { getEnv } from './utils/getenv';

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

    const pubSub = createPublisher(
      new PubSub({ projectId }),
      {
        getTripPatternsTopic:
          process.env['PUBSUB_TOPIC_TRIP_SEARCH'] || 'analytics_trip_search',
        getFeaturesTopic:
          process.env['PUBSUB_TOPIC_GEOCODER_FEATURES'] ||
          'analytics_geocoder_features',
        departuresSearchTopic:
          process.env['PUBSUB_TOPIC_DEPARTURES_SEARCH'] ||
          'analytics_departures_search',
        departuresSearchRealtimeTopic:
          process.env['PUBSUB_TOPIC_DEPARTURES_SEARCH_REALTIME'] ||
          'analytics_departure_realtime',
        departuresSearchGroupsTopic:
          process.env['PUBSUB_TOPIC_DEPARTURES_SEARCH_GROUPS'] ||
          'analytics_departure_groups_search'
      },
      {
        environment: getEnv()
      }
    );
    healthRoutes(server);
    journeyRoutes(server)(journeyService(enturService, pubSub));
    geocoderRoutes(server)(geocoderService(enturService, pubSub));
    stopsRoutes(server)(stopsService(enturService, pubSub));
    serviceJourneyRoutes(server)(serviceJourneyService(enturService));
    enrollmentRoutes(server)();

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
