import Hapi, { Server } from '@hapi/hapi';
import logfmt from 'logfmt';
import * as stream from 'stream';
import { Logger } from '../types/logfmt';
import { Boom } from '@hapi/boom';

interface LogFmtOptions {
  json: boolean;
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
      let l = logfmt.time('duration');
      l.stringify = JSON.stringify;
      if (!options.stream) options.stream = discardLogger;
      if (options.defaultFields) {
        l = l.namespace(options.defaultFields(request));
      }

      return {
        log: () => {
          if (options.json) l.stringify = JSON.stringify;
          l.log({}, options.stream);
        },
        with: obj => (l = l.namespace(obj))
      };
    };
    server.decorate('request', 'logfmt', logger, { apply: true });
    server.ext('onPreHandler', (request, h, err) => {
      request.logfmt.with(flatten(request.query));

      if (request.payload && typeof request.payload !== 'string') {
        request.logfmt.with(flatten(request.payload));
      }
      return h.continue;
    });
    server.ext('onPreResponse', (request, h, err) => {
      if (request.response instanceof Boom) {
        request.logfmt.with({ error: request.response.message });
      }
      return h.continue;
    });
    server.events.on('response', request => {
      if (request.raw.res && request.raw.res.statusCode) {
        const statusCode = request.raw.res.statusCode;
        request.logfmt.with({ code: statusCode.toString() });
        if (statusCode >= 400) {
          request.logfmt.with({ severity: 'ERROR' });
        } else {
          request.logfmt.with({ severity: 'INFO' });
        }
      }
      request.logfmt.log();
    });
  },
  name: 'logfmt'
};

export default plugin;
