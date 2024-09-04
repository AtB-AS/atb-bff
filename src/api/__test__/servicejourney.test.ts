import { Result } from '@badrap/result';
import Hapi from '@hapi/hapi';
import { createServer, initializePlugins } from '../../server';
import { IServiceJourneyService } from '../../service/interface';
import serviceJourney from '../servicejourney';
import { randomPort } from './common';

let server: Hapi.Server;
const svc: jest.Mocked<IServiceJourneyService> = {
  getDeparturesForServiceJourney: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getServiceJourneyMapInfo: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  )
};

beforeAll(async () => {
  server = createServer({
    port: randomPort()
  });

  await initializePlugins(server);
  serviceJourney(server)(svc);
  await server.initialize();
  await server.start();
});
afterAll(async () => {
  await server.stop();
});

describe('GET /bff/v1/servicejourney/{id}/polyline', () => {
  const url =
    '/bff/v1/servicejourney/ATB%3AServiceJourney%3A1_200109141595335_51/polyline?fromQuayId=NSR%3AQuay%3A75300&toQuayId=NSR%3AQuay%3A75301';
  it('parses query parameters correctly', async () => {
    await server.inject({
      method: 'get',
      url: url
    });
    expect(svc.getServiceJourneyMapInfo).toBeCalledWith(
      'ATB:ServiceJourney:1_200109141595335_51',
      {
        fromQuayId: 'NSR:Quay:75300',
        toQuayId: 'NSR:Quay:75301'
      }
    );
  });
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: url
    });
    expect(res.statusCode).toBe(200)
  });
});

describe('GET /bff/v1/servicejourney/{id}/departures', () => {
  const url =
    '/bff/v1/servicejourney/ATB%3AServiceJourney%3A1_200109141595335_51/departures';
  it('parses query parameters correctly', async () => {
    await server.inject({
      method: 'get',
      url: url
    });
    expect(svc.getDeparturesForServiceJourney).toBeCalledWith(
      'ATB:ServiceJourney:1_200109141595335_51',
      {
        date: undefined
      }
    );
  });
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: url
    });
    expect(res.statusCode).toBe(200)
  });
});
