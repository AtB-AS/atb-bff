import { createServer, initializePlugins } from '../../server';
import { randomPort } from './common';
import routes from '../departures';
import Hapi from '@hapi/hapi';
import { IDeparturesService } from '../../service/interface';
import { Result } from '@badrap/result';
import { TripsQueryWithJourneyIds } from '../../types/trips';
import { compressToEncodedURIComponent } from 'lz-string';
import { FavouriteDepartureQueryVariables } from '../../service/impl/departures/gql/jp3/favourite-departure.graphql-gen';

let server: Hapi.Server;

const svc: jest.Mocked<IDeparturesService> = {
  getFavouriteDepartures: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getDepartureRealtime: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getQuayDepartures: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getStopPlacesByPosition: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getStopQuayDepartures: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
  getStopsDetails: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  )
};

beforeAll(async () => {
  server = createServer({
    port: randomPort()
  });

  await initializePlugins(server);
  routes(server)(svc);
  await server.initialize();
  await server.start();
});
afterAll(async () => {
  await server.stop();
});

describe('GET /bff/v2/departures/favourites', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/bff/v2/departures/favourites',
      payload: {
        lines: ['ATB:Line:2_25'],
        quayIds: ['NSR:Quay:72405']
      } as FavouriteDepartureQueryVariables
    });
    expect(res.statusCode).toBe(200);
  });
});
