import Hapi, { Server } from '@hapi/hapi';
import logfmt from 'logfmt';
import * as stream from 'stream';
import { Logger } from '../types/logfmt';
import { Boom } from '@hapi/boom';

interface LogFmtOptions {
  stream?: stream.Writable;
  defaultFields?: (request: Hapi.Request) => Record<string, string | undefined>;
}

const discardLogger = new stream.Writable({
  write(chunk, encoding, callback) {
    setImmediate(callback);
  }
});

const flatten = (
  obj: object,
  prefix: string = '',
  res: Record<string, any> = {}
) =>
  Object.entries(obj).reduce((r, [key, val]) => {
    const k = `${prefix}${key}`;
    if (typeof val === 'object') {
      flatten(val, `${k}_`, r);
    } else {
      res[k] = val;
    }
    return r;
  }, res);

const plugin: Hapi.Plugin<LogFmtOptions> = {
  dependencies: 'atb-headers',
  register: async (server: Server, options: LogFmtOptions) => {
    const logger = (request: Hapi.Request): Logger => {
      let l = logfmt.time('took');
      if (!options.stream) options.stream = discardLogger;
      if (options.defaultFields) {
        l = l.namespace(options.defaultFields(request));
      }

      return {
        log: () => l.log({}, options.stream),
        with: obj => (l = l.namespace(obj))
      };
    };
    server.decorate('request', 'logfmt', logger, { apply: true });
    server.ext('onPreHandler', (request, h, err) => {
      request.logfmt.with(flatten(request.query));
      /* if (request.payload && typeof request.payload !== 'string') {
        request.logfmt.with(flatten(request.payload));
      }*/
      return h.continue;
    });
    server.ext('onPreResponse', (request, h, err) => {
      if (request.response instanceof Boom) {
        request.logfmt.with({ err: request.response.message });
      }
      return h.continue;
    });
    server.events.on('response', request => {
      request.logfmt.with({ code: request.raw.res.statusCode.toString() });
      request.logfmt.log();
    });
  },
  name: 'logfmt'
};

export default plugin;
