import Hapi from '@hapi/hapi';
import { createServer, initializePlugins } from '../../server';
import * as routes from '../../api/geocoder';

import { IGeocoderService } from '../../service/interface';
import { Result } from '@badrap/result';
import { randomPort } from './common';

let server: Hapi.Server;
const svc: jest.Mocked<IGeocoderService> = {
  getFeatures: jest.fn((...args: any): any => Result.ok(Promise.resolve([]))),
  getFeaturesReverse: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  )
};
beforeAll(async () => {
  server = createServer({
    port: randomPort()
  });

  await server.register([
    {
      plugin: routes.getFeatures,
      options: {
        deps: svc
      },
      routes: {
        prefix: '/bff'
      }
    },
    {
      plugin: routes.getFeaturesReverse,
      options: {
        deps: svc
      },
      routes: {
        prefix: '/bff'
      }
    }
  ]);

  await server.initialize();
  await server.start();
});
afterAll(async () => {
  await server.stop();
});

describe('GET /bff/v1/geocoder/reverse', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/geocoder/reverse?lat=63.43&lon=10.34'
    });

    expect(res.statusCode).toBe(200);
  });
  it('calls the service with the correct arguments', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/geocoder/reverse?lat=63.43&lon=10.34'
    });

    expect(svc.getFeaturesReverse).toBeCalledWith({ lat: 63.43, lon: 10.34 });
  });
  it('responds with 400 for missing required parameters', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/geocoder/reverse?radius=10'
    });

    expect(res.statusCode).toBe(400);
  });
});
describe('GET /bff/v1/geocoder/features', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/geocoder/features?query=Trondheim&lat=63.43&lon=10.34'
    });

    expect(res.statusCode).toBe(200);
  });
  it('calls the service with the correct arguments', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/geocoder/features?query=Trondheim&lat=63.43&lon=10.34'
    });

    expect(svc.getFeatures).toBeCalledWith({
      lat: 63.43,
      lon: 10.34,
      query: 'Trondheim'
    });
  });
  it('responds with 400 for malformed queries', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/geocoder/features?query='
    });

    expect(res.statusCode).toBe(400);
  });
  it('converts comma-separated query-parameters to string array', async () => {
    const res = await server.inject({
      method: 'get',
      url:
        '/bff/v1/geocoder/features?query=Trondheim&lat=63.43&lon=10.34&layers=venue,address'
    });
    expect(svc.getFeatures).toBeCalledWith({
      lat: 63.43,
      lon: 10.34,
      query: 'Trondheim',
      layers: ['venue', 'address']
    });
  });
});
