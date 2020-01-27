import Hapi from '@hapi/hapi';

import { createServer, initializePlugins } from '../../server';
import geocoderRoutes, { IGeocoderService } from '../geocoder';

let server: Hapi.Server;
let svc: jest.Mocked<IGeocoderService>;
beforeEach(async () => {
  server = createServer();
  svc = {
    getFeatures: jest.fn((...args: any) => Promise.resolve([])),
    getFeaturesReverse: jest.fn((...args: any) => Promise.resolve([]))
  };
  await initializePlugins(server);
  geocoderRoutes(server)(svc);
  await server.initialize();
  await server.start();
});

afterEach(async () => {
  await server.stop();
});

describe('GET /geocoder/reverse', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/geocoder/reverse?lat=63.43&lon=10.34'
    });

    expect(res.statusCode).toBe(200);
  });
  it('calls the service with the correct arguments', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/geocoder/reverse?lat=63.43&lon=10.34'
    });

    expect(svc.getFeaturesReverse).toBeCalledWith(
      { latitude: 63.43, longitude: 10.34 },
      {}
    );
  });
  it('responds with 400 for missing required parameters', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/geocoder/reverse?radius=10'
    });

    expect(res.statusCode).toBe(400);
  });
});
describe('GET /geocoder/feature', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/geocoder/feature?query=Trondheim&lat=63.43&lon=10.34'
    });

    expect(res.statusCode).toBe(200);
  });
  it('calls the service with the correct arguments', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/geocoder/feature?query=Trondheim&lat=63.43&lon=10.34'
    });

    expect(svc.getFeatures.mock.calls[0]).toEqual([
      'Trondheim',
      {
        latitude: 63.43,
        longitude: 10.34
      },
      {}
    ]);
  });
  it('responds with 400 for malformed queries', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/geocoder/feature?query='
    });

    expect(res.statusCode).toBe(400);
  });
});
