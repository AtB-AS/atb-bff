import 'reflect-metadata';

import Hapi from '@hapi/hapi';

import { init, createServer } from '../../server';

let server: Hapi.Server;
beforeEach(async () => {
  server = createServer();
  await init(server);
});

afterEach(async () => {
  await server.stop();
});

describe('GET /journey/trip', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/journey/trip?from=Trondheim&to=Oslo'
    });

    expect(res.statusCode).toBe(200);
  });
  it('responds with 400 for missing required parameters', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/geocoder/from=Trondheim'
    });

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /journey/trip', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/journey/trip',
      payload: {
        from: {
          name: 'Trondheim',
          coordinates: {
            latitude: 63.43,
            longitude: 10.34
          }
        },
        to: {
          name: 'Oslo',
          coordinates: {
            latitude: 59.9139,
            longitude: 10.7522
          }
        }
      }
    });

    expect(res.statusCode).toBe(200);
  });
});
