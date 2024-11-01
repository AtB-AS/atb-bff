import Hapi from '@hapi/hapi';
import appVersionCheckerPlugin from '../app-version-checker-plugin';
import atbHeaders from '../atb-headers';

describe('appVersionCheckerPlugin', () => {
  let server: Hapi.Server;

  const doRequest = ({
    appVersion,
    webshopVersion,
  }: {
    appVersion?: string;
    webshopVersion?: string;
  }) =>
    server.inject({
      method: 'GET',
      headers: {
        'atb-app-version': appVersion,
        'atb-webshop-version': webshopVersion,
      },
      url: '/',
    });

  beforeAll(async () => {
    server = Hapi.server();
    await server.register(atbHeaders);
    await server.register(appVersionCheckerPlugin);

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
    let response = await doRequest({appVersion: '1.1'});
    expect(response.statusCode).toBe(426);

    response = await doRequest({appVersion: '0.5'});
    expect(response.statusCode).toBe(426);

    response = await doRequest({appVersion: '1.99'});
    expect(response.statusCode).toBe(426);

    response = await doRequest({appVersion: '2.0'});
    expect(response.statusCode).toBe(426);

    response = await doRequest({appVersion: '2.24.9'});
    expect(response.statusCode).toBe(426);
  });

  it('should allow requests where app version is higher or equal to the min app version', async () => {
    process.env.MIN_APP_VERSION = '2.25';

    let response = await doRequest({appVersion: '3.0'});
    expect(response.statusCode).toBe(200);

    response = await doRequest({appVersion: '2.26'});
    expect(response.statusCode).toBe(200);

    response = await doRequest({appVersion: '2.25.1'});
    expect(response.statusCode).toBe(200);

    response = await doRequest({appVersion: '2.25'});
    expect(response.statusCode).toBe(200);
  });

  it('should allow requests if no client app version and there is a webshop version', async () => {
    process.env.MIN_APP_VERSION = '2.25';

    let response = await doRequest({webshopVersion: '2.0'});
    expect(response.statusCode).toBe(200);
  });

  it('should reject requests if no client app version and no webshop version', async () => {
    process.env.MIN_APP_VERSION = '2.25';

    let response = await doRequest({});
    expect(response.statusCode).toBe(426);
  });

  it('should allow requests if no min app version', async () => {
    process.env.MIN_APP_VERSION = undefined;

    let response = await doRequest({appVersion: '3.0'});
    expect(response.statusCode).toBe(200);

    response = await doRequest({appVersion: '0.1'});
    expect(response.statusCode).toBe(200);
  });
});
