import Hapi, { Server } from '@hapi/hapi';
import logfmt from 'logfmt';
import * as stream from 'stream';
import { LogFmt } from '../types/logfmt';

interface LogFmtOptions {
  stream?: stream.Writable
  defaults?: (request: Hapi.Request) => Record<string, string>
}

const plugin: Hapi.Plugin<LogFmtOptions> = {
  register: async (server: Server, options: LogFmtOptions) => {
    const logger = (request: Hapi.Request): LogFmt => {
      let l = logfmt.time('took');
      if (!options.stream) options.stream = process.stdout;
      if (options.defaults) {
        l = l.namespace(options.defaults(request));
      }

      return {
        log: (...keyval: string[]) => {
          if (keyval.length == 0) {
            l.log({}, options.stream);
          }

          if (keyval.length % 2 !== 0) {
            keyval = [...keyval, ''];
          }

          l = l.namespace(keyval.reduce((a, c, i, ar) => {
            if (i % 2 !== 0) {
              return a;
            }
            a[c] = ar[i + 1];
            return a;
          }, {} as Record<string, string>));
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
