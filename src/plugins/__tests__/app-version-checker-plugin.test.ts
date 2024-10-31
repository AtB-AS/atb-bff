import Hapi from '@hapi/hapi';
import appVersionCheckerPlugin from '../app-version-checker-plugin';
import atbHeaders from '../atb-headers';

describe('appVersionCheckerPlugin', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = Hapi.server();
    await server.register(atbHeaders);
    await server.register({plugin: appVersionCheckerPlugin});

    // Sample route to test against
    server.route({
      method: 'GET',
      path: '/',
      handler: (_, h) => h.response().code(200),
    });
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should reject requests where app version is too low', async () => {
    process.env.MIN_APP_VERSION = '2.25';
    let response = await doRequest(server, '1.1', 'installId');
    expect(response.statusCode).toBe(426);

    response = await doRequest(server, '0.5', 'installId');
    expect(response.statusCode).toBe(426);

    response = await doRequest(server, '1.99', 'installId');
    expect(response.statusCode).toBe(426);

    response = await doRequest(server, '2.0', 'installId');
    expect(response.statusCode).toBe(426);

    response = await doRequest(server, '2.24.9', 'installId');
    expect(response.statusCode).toBe(426);
  });

  it('should allow requests where app version is higher or equal to the min app version', async () => {
    process.env.MIN_APP_VERSION = '2.25';

    let response = await doRequest(server, '3.0', 'installId');
    expect(response.statusCode).toBe(200);

    response = await doRequest(server, '2.99', 'installId');
    expect(response.statusCode).toBe(200);

    response = await doRequest(server, '2.26', 'installId');
    expect(response.statusCode).toBe(200);

    response = await doRequest(server, '2.25.1', 'installId');
    expect(response.statusCode).toBe(200);

    response = await doRequest(server, '2.25', 'installId');
    expect(response.statusCode).toBe(200);
  });

  it('should allow requests if no client app version and no install id', async () => {
    process.env.MIN_APP_VERSION = '2.25';

    let response = await doRequest(server, undefined, undefined);
    expect(response.statusCode).toBe(200);
  });

  it('should reject requests if no client app version and an install id', async () => {
    process.env.MIN_APP_VERSION = '2.25';

    let response = await doRequest(server, undefined, 'installId');
    expect(response.statusCode).toBe(426);
  });

  it('should allow requests if no min app version', async () => {
    process.env.MIN_APP_VERSION = undefined;

    let response = await doRequest(server, '3.0', 'installId');
    expect(response.statusCode).toBe(200);

    response = await doRequest(server, '0.1', 'installId');
    expect(response.statusCode).toBe(200);
  });
});

const doRequest = (
  server: Hapi.Server,
  appVersion: string | undefined,
  installId: string | undefined,
) =>
  server.inject({
    method: 'GET',
    headers: {'atb-app-version': appVersion, 'atb-install-id': installId},
    url: '/',
  });
