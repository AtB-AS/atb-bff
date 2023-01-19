import { Boom } from '@hapi/boom';
import { createServer, initializePlugins } from './server';
import enturClient from './service/impl/entur';

import geocoderService from './service/impl/geocoder';
import stopsService from './service/impl/stops';
import departuresService from './service/impl/departures';
import tripsService from './service/impl/trips';
import quayService from './service/impl/quays';
import enrollmentService from './service/impl/enrollment';
import vehicleService from './service/impl/vehicles';

import geocoderRoutes from './api/geocoder';
import stopsRoutes from './api/stops';
import healthRoutes from './api/health';
import enrollmentRoutes from './api/enrollment';
import tripsRoutes from './api/trips';
import departureRoutes from './api/departures';
import quayRoutes from './api/quays';
import vehicleRoutes from './api/vehicles';

import { serviceJourneyRoutes_v2 } from './api/servicejourney';
import { serviceJourneyService_v2 } from './service/impl/service-journey';
import vippsLoginRoutes from './api/vipps-login';

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(-1);
});

(async () => {
  try {
    console.info('⏳ Starting server...');

    const port = process.env['PORT'] || '8080';
    const server = createServer({
      port: port
    });
    const enturService = enturClient();
    await initializePlugins(server);
    server.route({
      method: '*',
      path: '/{any*}',
      handler: (request, h) =>
        new Boom('The requested resource was not found.', { statusCode: 404 })
    });

    healthRoutes(server);
    stopsRoutes(server)(stopsService());
    geocoderRoutes(server)(geocoderService(enturService));
    enrollmentRoutes(server)(enrollmentService());
    quayRoutes(server)(quayService());
    vehicleRoutes(server)(vehicleService());

    // JP3
    tripsRoutes(server)(tripsService());
    departureRoutes(server)(departuresService());
    serviceJourneyRoutes_v2(server)(serviceJourneyService_v2());
    vippsLoginRoutes(server)();

    await server.initialize();
    await server.start();

    console.info('✅ Server started at http://localhost:' + port);
  } catch (error: any) {
    console.error(
      `failed to initialize server: ${error?.message}, terminating process.`
    );
    console.error(error?.stack);
    process.exit(-1);
  }
})();
