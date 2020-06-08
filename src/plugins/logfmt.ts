import Hapi, { Server } from '@hapi/hapi';
import logfmt from 'logfmt';
import url from 'url';
import * as stream from 'stream';

interface LogFmtOptions {
  stream: stream.Writable
}

const plugin: Hapi.Plugin<LogFmtOptions> = {
  register: async (server: Server, options: LogFmtOptions) => {
    if (process.env.NODE_ENV === 'test') return;

    server.events.on('response', (req) => {
      logfmt.log({
        ts: new Date().toISOString(),
        method: req.method.toUpperCase(),
        url: url.format(req.url, { search: false }),
        took: `${req.info.completed - req.info.received}ms`,
        code: req.raw.res.statusCode,
        query: req.url.searchParams
      }, options.stream);
    });
  },
  name: 'logfmt'
};

export default plugin;
