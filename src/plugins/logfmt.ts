import Hapi, { Server } from '@hapi/hapi';
import logfmt from 'logfmt';
import * as stream from 'stream';
import { Logger } from '../types/logfmt';

interface LogFmtOptions {
  stream?: stream.Writable;
  defaultFields?: (request: Hapi.Request) => Record<string, string>;
}

const discardLogger = new stream.Writable(
  {
    write(chunk, encoding, callback) {
      setImmediate(callback);
    }
  }
);

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
        with: (...keyval: string[]) => {
          if (keyval.length % 2 !== 0) {
            keyval = [...keyval, ''];
          }

          l = l.namespace(
            keyval.reduce<Record<string, string>>((a, c, i, ar) => {
              if (i % 2 !== 0) {
                return a;
              }
              a[c] = ar[i + 1];
              return a;
            }, {})
          );
        }
      };
    };
    server.decorate('request', 'logfmt', logger, { apply: true });
    server.ext('onPreResponse', (request, h) => {
      request.logfmt.log();
      return h.continue;
    });
  },
  name: 'logfmt'
};

export default plugin;
