import Hapi from '@hapi/hapi';
import { createServer, initializePlugins } from '../../server';
import stopsRoutes from '../stops';
import { IStopsService } from '../../service/interface';
import { Result } from '@badrap/result';
import { randomPort } from './common';
import { APIError } from '../../service/types';

let server: Hapi.Server;
let svc: jest.Mocked<IStopsService>;

beforeEach(async () => {
  server = createServer({
    port: randomPort()
  });
  svc = {
    getDeparturesFromStopPlace: jest.fn((...args: any): any =>
      Result.ok(Promise.resolve([]))
    ),
    getStopPlace: jest.fn((...args: any): any =>
      Result.ok({
        message: 'It works!'
      })
    ),
    getStopPlacesByPosition: jest.fn((...args: any): any =>
      Result.ok(Promise.resolve([]))
    )
  };
  await initializePlugins(server);
  stopsRoutes(server)(svc);
  await server.initialize();
  await server.start();
});

afterEach(async () => {
  await server.stop();
});

describe('GET /stop/{id}', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/stop/NSR:StopPlace:337'
    });

    expect(res.statusCode).toBe(200);
  });
  it('responds with 404 for missing id', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/stop/'
    });

    expect(res.statusCode).toBe(404);
  });
});
describe('GET /stops/{id}/departures', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/stop/NSR:StopPlace:44042/departures'
    });

    expect(res.statusCode).toBe(200);
  });
});
describe('GET /stops', () => {
  it('response with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/stops?lat=63.3818027&lon=10.3677379'
    });

    expect(res.statusCode).toBe(200);
  });

  it('responds with 400 for missing required parameters', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/stops?invalid=wut'
    });

    expect(res.statusCode).toBe(400);
  });
});
