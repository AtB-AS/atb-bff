import {createServer, initializePlugins} from "../../server";
import {randomPort} from "./common";
import routes from "../trips";
import Hapi from "@hapi/hapi";
import {IStopsService, ITrips_v3} from "../../service/interface";
import {Result} from "@badrap/result";

let server: Hapi.Server;

const svc: jest.Mocked<ITrips_v3> = {
  getTrips: jest.fn((...args: any): any =>
    Result.ok(Promise.resolve([]))
  ),
}

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

    const from = JSON.stringify({
      place: "NSR:StopPlace:43460"
    });

    const to = JSON.stringify({
      place: "NSR:StopPlace:60447"
    });

    const res = await server.inject({
      method: 'get',
      url: `/bff/v2/trips?from=${from}&to=${to}`
    });
    expect(res.statusCode).toBe(200);

  });
});


