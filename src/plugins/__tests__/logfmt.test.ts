import Hapi from '@hapi/hapi';
import * as stream from 'stream';
import logFmtPlugin from '../logfmt';
import atbHeaders from '../atb-headers';

describe('logfmt', () => {
  let server: Hapi.Server;
  let lines: string[] = [];

  const capture = new stream.Writable({
    write(chunk, _encoding, callback) {
      lines.push(chunk.toString());
      callback();
    },
  });

  beforeAll(async () => {
    server = Hapi.server();
    await server.register(atbHeaders);
    await server.register({
      plugin: logFmtPlugin,
      options: {json: true, stream: capture},
    });

    server.route({
      method: 'POST',
      path: '/logs-payload',
      handler: (_, h) => h.response().code(200),
    });
    server.route({
      method: 'POST',
      path: '/no-payload',
      options: {plugins: {logfmt: {payload: false}}},
      handler: (_, h) => h.response().code(200),
    });
  });

  const post = async (url: string) => {
    lines = [];
    await server.inject({
      method: 'POST',
      url,
      payload: {legs: [{id: 'leg-1'}]},
    });
    return lines;
  };

  it('flattens the payload only when the route allows it', async () => {
    expect(await post('/logs-payload')).toEqual([
      expect.stringContaining('legs_0_id'),
    ]);

    // The line is still written, it just carries no payload fields.
    const optedOut = await post('/no-payload');
    expect(optedOut).toHaveLength(1);
    expect(optedOut[0]).not.toContain('legs_0_id');
    expect(optedOut[0]).toContain('"code":"200"');
  });
});
