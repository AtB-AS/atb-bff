import Hapi from '@hapi/hapi';
import { createServer, initializePlugins } from '../../server';
import stopsRoutes from '../stops';
import { IStopsService } from '../../service/interface';
import { Result } from '@badrap/result';
import { randomPort } from './common';

let server: Hapi.Server;
const svc: jest.Mocked<IStopsService> = {
  getDeparturesBetweenStopPlaces: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDeparturesForServiceJourney: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDeparturesFromQuay: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getNearestPlaces: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getQuaysForStopPlace: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDeparturesFromStopPlace: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getStopPlace: jest.fn((...args: any): any => Result.ok('ok')),
  getStopPlacesByPosition: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  )
};

beforeAll(async () => {
  server = createServer({
    port: randomPort()
  });

  await initializePlugins(server);
  stopsRoutes(server)(svc);
  await server.initialize();
  await server.start();
});
afterAll(async () => {
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
  it('responds with 200', async () => {
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
describe('GET /departures', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/departures?from=NSR:StopPlace:42624&to=NSR:StopPlace:41609'
    });
  });
  it('parses query parameters correctly', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/departures?from=NSR:StopPlace:42624&to=NSR:StopPlace:41609'
    });
    expect(svc.getDeparturesBetweenStopPlaces).toBeCalledWith({
      from: 'NSR:StopPlace:42624',
      to: 'NSR:StopPlace:41609'
    });
  });
});
