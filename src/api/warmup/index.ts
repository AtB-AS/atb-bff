/* eslint no-console: 0 */
import Hapi from '@hapi/hapi';

/**
 * A fresh pod pays a one-time CPU cost while V8 compiles and optimizes the request pipeline
 *
 * This endpoint warms up the more important parts of the code and then returns 200.
 */

const MAX_WARMUP_MS = 20_000;

const FROM = {latitude: 63.4365, longitude: 10.399};
const TO = {latitude: 63.412, longitude: 10.4045};
const CENTRE = {lat: 63.4305, lon: 10.3951};

let warmupPromise: Promise<void> | undefined;

export const startWarmup = (server: Hapi.Server): Promise<void> =>
  (warmupPromise ??= warmup(server));

export default (server: Hapi.Server) => {
  server.route({
    method: 'GET',
    path: '/bff/warmup',
    options: {
      description: 'Blocks until the startup warmup has finished',
      tags: ['health'],
    },
    handler: async (_request, h) => {
      await startWarmup(server);
      return h.response('OK').header('cache-control', 'no-store');
    },
  });
};

async function warmup(server: Hapi.Server) {
  const started = Date.now();
  const timeout = new Promise<'timeout'>((resolve) =>
    setTimeout(() => resolve('timeout'), MAX_WARMUP_MS).unref(),
  );
  const outcome = await Promise.race([
    runWarmup(server).then(() => 'done' as const),
    timeout,
  ]).catch(() => 'failed' as const);
  console.info(`🔥 Warmup ${outcome} in ${Date.now() - started}ms`);
}

async function runWarmup(server: Hapi.Server) {
  const qs = (params: Record<string, string | number>) =>
    new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();

  // Most of the cold startup cost is shared code:
  // - The geocoder warms the REST path
  // - stops-nearest the GraphQL path (Apollo, node-fetch, JSON parsing)
  // - trips the trip mapping shared with singleTrip and non-transit
  const routes: Array<[method: string, url: string, payload?: object]> = [
    [
      'GET',
      `/bff/v2/geocoder/features?${qs({query: 'prinsens gate', lat: CENTRE.lat, lon: CENTRE.lon})}`,
    ],
    [
      'GET',
      `/bff/v2/departures/stops-nearest?${qs({latitude: CENTRE.lat, longitude: CENTRE.lon, distance: 1000, count: 10})}`,
    ],
    [
      'POST',
      '/bff/v2/trips',
      {
        from: {name: 'Trondheim S', coordinates: FROM},
        to: {name: 'Lerkendal', coordinates: TO},
        arriveBy: false,
      },
    ],
  ];

  await Promise.all(
    routes.map(([method, url, payload]) =>
      server.inject({method, url, payload}).catch(() => undefined),
    ),
  );
}
