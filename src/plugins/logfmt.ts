import Hapi, {Server} from '@hapi/hapi';
import logfmt from 'logfmt';
import * as stream from 'stream';
import {Logger} from '../types/logfmt';
import {Boom} from '@hapi/boom';

interface LogFmtOptions {
  json: boolean;
  stream?: stream.Writable;
  defaultFields?: (request: Hapi.Request) => Record<string, string | undefined>;
}

const discardLogger = new stream.Writable({
  write(chunk, encoding, callback) {
    setImmediate(callback);
  },
});

const MAX_FLATTEN_DEPTH = 3;

const flatten = (
  obj: object,
  prefix: string = '',
  res: Record<string, any> = {},
  depth: number = 0,
) =>
  Object.entries(obj).reduce((r, [key, val]) => {
    const k = `${prefix}${key}`;
    if (typeof val === 'object' && val !== null) {
      if (depth < MAX_FLATTEN_DEPTH) {
        flatten(val, `${k}_`, r, depth + 1);
      } else {
        res[k] = `[TRUNCATED depth=${MAX_FLATTEN_DEPTH}]`;
      }
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

      let suppressed = false;

      return {
        log: (force = false) => {
          if (suppressed && !force) return;
          if (options.json) l.stringify = JSON.stringify;
          l.log({}, options.stream);
        },
        with: (obj) => (l = l.namespace(obj)),
        suppress: () => {
          suppressed = true;
        },
      };
    };
    server.decorate('request', 'logfmt', logger, {apply: true});
    server.ext('onPreHandler', (request, h) => {
      request.logfmt.with(flatten(request.query));

      // Routes opt out of body logging with `plugins: {logfmt: {payload: false}}`.
      if (
        request.route.settings.plugins?.logfmt?.payload !== false &&
        request.payload &&
        typeof request.payload !== 'string'
      ) {
        request.logfmt.with(flatten(request.payload));
      }
      return h.continue;
    });
    server.ext('onPreResponse', (request, h) => {
      if (request.response instanceof Boom) {
        request.logfmt.with({error: request.response.message});
      }
      return h.continue;
    });
    server.events.on('response', (request) => {
      let isError = false;
      if (request.raw.res && request.raw.res.statusCode) {
        const statusCode = request.raw.res.statusCode;
        isError = statusCode >= 400;
        request.logfmt.with({code: statusCode.toString()});
        request.logfmt.with({severity: isError ? 'ERROR' : 'INFO'});
      }
      // An error is always logged, even if the handler suppressed the line.
      request.logfmt.log(isError);
    });
  },
  name: 'logfmt',
};

export default plugin;
