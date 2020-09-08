import Hapi from '@hapi/hapi';
import { createServer, initializePlugins } from '../../server';
import stopsRoutes from '../stops';
import { IStopsService } from '../../service/interface';
import { Result } from '@badrap/result';
import { randomPort } from './common';

let server: Hapi.Server;
const svc: jest.Mocked<IStopsService> = {
  getNearestDepartures: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getStopPlacesByName: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDeparturesBetweenStopPlaces: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDeparturesForServiceJourney: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDeparturesFromQuay: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDepartures: jest.fn((...args: any): any => Result.ok(Promise.resolve([]))),
  getDeparturesPaging: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDepartureRealtime: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getStopPlacesByBbox: jest.fn((...args: any): any =>
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

describe('GET /bff/v1/stop/{id}', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/stop/NSR:StopPlace:337'
    });

    expect(res.statusCode).toBe(200);
  });
  it('responds with 404 for missing id', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/stop'
    });

    expect(res.statusCode).toBe(404);
  });
});
describe('GET /bff/v1/stops/{id}/departures', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/stop/NSR:StopPlace:44042/departures'
    });

    expect(res.statusCode).toBe(200);
  });
});
describe('GET /bff/v1/stops/nearest', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/stops/nearest?lat=63.3818027&lon=10.3677379'
    });

    expect(res.statusCode).toBe(200);
  });

  it('responds with 400 for missing required parameters', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/stops/nearest?invalid=wut'
    });

    expect(res.statusCode).toBe(400);
  });
});
describe('GET /bff/v1/stops', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/stops?query=Prinsens gate&lat=63.433&lon=10.399'
    });
    expect(res.statusCode).toBe(200);
  });
  it('responds with 400 for invalid parameters', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/stops?query=Konges gate&lon=10.399'
    });
    expect(res.statusCode).toBe(400);
  });
});
describe('GET /bff/v1/departures/nearest', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/departures/nearest?lat=63.361901&lon=10.377521'
    });
    expect(res.statusCode).toBe(200);
  });
  it('responds with 400 for invalid parameters', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/departures/nearest?lon=10.399'
    });
    expect(res.statusCode).toBe(400);
  });
});
describe('GET /bff/v1/departures', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/departures?from=NSR:StopPlace:42624&to=NSR:StopPlace:41609'
    });
  });
  it('parses query parameters correctly', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v1/departures?from=NSR:StopPlace:42624&to=NSR:StopPlace:41609'
    });
    expect(svc.getDeparturesBetweenStopPlaces).toBeCalledWith({
      from: 'NSR:StopPlace:42624',
      to: 'NSR:StopPlace:41609'
    });
  });
});
