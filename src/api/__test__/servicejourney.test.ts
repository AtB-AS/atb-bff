import { Result } from '@badrap/result';
import Hapi from '@hapi/hapi';
import { createServer, initializePlugins } from '../../server';
import { IServiceJourneyService } from '../../service/interface';
import serviceJourney from '../servicejourney';
import { randomPort } from './common';

let server: Hapi.Server;
const svc: jest.Mocked<IServiceJourneyService> = {
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
    const res = await server.inject({
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
});
