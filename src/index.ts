/* eslint no-console: 0 */
import {Boom} from '@hapi/boom';
import {createServer, initializePlugins} from './server';

import geocoderService from './service/impl/geocoder';
import departuresGroupedService from './service/impl/departures-grouped';
import departuresService from './service/impl/departures';
import realtimeService from './service/impl/realtime';
import tripsService from './service/impl/trips';
import quayService from './service/impl/quays';
import enrollmentService from './service/impl/enrollment';
import mobilityService from './service/impl/mobility';
import vehiclesService from './service/impl/vehicles';

import geocoderRoutes from './api/geocoder';
import departuresGroupedRoutes from './api/departures-grouped';
import realtimeRoutes from './api/realtime';
import healthRoutes from './api/health';
import enrollmentRoutes from './api/enrollment';
import tripsRoutes from './api/trips';
import departureRoutes from './api/departures';
import quayRoutes from './api/quays';
import mobilityRoutes from './api/mobility';
import vehiclesRoutes from './api/vehicles';

import {serviceJourneyRoutes_v2} from './api/servicejourney';
import {serviceJourneyService_v2} from './service/impl/service-journey';
import vippsLoginRoutes from './api/vipps-login';

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(-1);
});

(async () => {
  try {
    console.info('⏳ Starting server...');

    const port = process.env['PORT'] || '8080';
    const server = createServer({
      port: port,
    });
    await initializePlugins(server);
    server.route({
      method: '*',
      path: '/{any*}',
      handler: () =>
        new Boom('The requested resource was not found.', {statusCode: 404}),
    });

    healthRoutes(server);
    departuresGroupedRoutes(server)(departuresGroupedService());
    geocoderRoutes(server)(geocoderService());
    enrollmentRoutes(server)(enrollmentService());
    quayRoutes(server)(quayService());
    mobilityRoutes(server)(mobilityService());
    vehiclesRoutes(server)(vehiclesService());

    // JP3
    tripsRoutes(server)(tripsService());
    departureRoutes(server)(departuresService());
    realtimeRoutes(server)(realtimeService());
    serviceJourneyRoutes_v2(server)(serviceJourneyService_v2());
    vippsLoginRoutes(server)();

    await server.initialize();
    await server.start();

    console.info('✅ Server started at http://localhost:' + port);
  } catch (error: any) {
    console.error(
      `failed to initialize server: ${error?.message}, terminating process.`,
    );
    console.error(error?.stack);
    process.exit(-1);
  }
})();
