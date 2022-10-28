import { createServer, initializePlugins } from '../../server';
import { randomPort } from './common';
import routes from '../trips';
import Hapi from '@hapi/hapi';
import { IStopsService, ITrips_v2 } from '../../service/interface';
import { Result } from '@badrap/result';
import { TripsQueryWithJourneyIds } from '../../types/trips';
import { compressToEncodedURIComponent } from 'lz-string';

let server: Hapi.Server;

const svc: jest.Mocked<ITrips_v2> = {
  getTrips: jest.fn((...args: any): any => Result.ok(Promise.resolve([]))),
  getSingleTrip: jest.fn((...args: any): any => Result.ok(Promise.resolve([])))
};

const singleTripquery: TripsQueryWithJourneyIds = {
  query: {
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
    },
    arriveBy: false
  },
  journeyIds: ['abc', 'def']
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

describe('GET /bff/v2/trips', () => {
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'post',
      url: `/bff/v2/trips`,
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
        },
        arriveBy: false
      }
    });
    expect(res.statusCode).toBe(200);
  });
});

describe('POST /bff/v2/singleTrip', () => {
  it('responds with 200', async () => {
    const compressedQuery = compressToEncodedURIComponent(
      JSON.stringify(singleTripquery)
    );

    const res = await server.inject({
      method: 'post',
      url: `/bff/v2/singleTrip`,
      payload: { compressedQuery }
    });
    expect(res.statusCode).toBe(200);
  });
});
