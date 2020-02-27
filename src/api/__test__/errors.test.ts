import Hapi from '@hapi/hapi';
import journeyRoutes from '../journey';
import { IJourneyService } from '../../service/interface';
import { Result } from '@badrap/result';
import { createServer, initializePlugins } from '../../server';
import { randomPort } from './common';
import { FetchError } from 'node-fetch';
import { APIError } from '../../service/types';

let server: Hapi.Server;

const errorCodesToTest = [
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ENOTFOUND',
  'EPIPE'
];

const failingServiceCall = jest.fn();
errorCodesToTest.forEach(e =>
  failingServiceCall.mockReturnValue(
    Promise.resolve(
      Result.err(
        //@ts-ignore
        new APIError(new FetchError('request failed', 'system', { code: e }))
      )
    )
  )
);
const svc: jest.Mocked<IJourneyService> = {
  getTripPatterns: jest.fn((args: any): any => Result.ok(Promise.resolve([]))),
  getTrips: failingServiceCall
};

beforeAll(async () => {
  server = createServer({
    port: randomPort()
  });

  await initializePlugins(server);
  journeyRoutes(server)(svc);
  await server.initialize();
  await server.start();
});
afterAll(async () => {
  await server.stop();
});

describe('GET /journey/trip', () => {
  errorCodesToTest.forEach(err => {
    it(`responds with 503 for upstream error ${err}`, async () => {
      const res = await server.inject({
        method: 'get',
        url: '/journey/trip?from=Trondheim&to=Oslo'
      });
      expect(res.statusCode).toBe(503);
    });
  });
});
