import Hapi from '@hapi/hapi';
import traceAgent = require('@google-cloud/trace-agent');

interface Options {
  headers: string[];
}

const plugin: Hapi.Plugin<Options> = {
  register: async (server, options) => {
    const getHeader = (request: Hapi.Request, name: string) => {
      return request.headers[name.toLowerCase()];
    };
    server.ext('onRequest', async (request, h) => {
      options.headers.forEach(h => {
        const v = getHeader(request, h);
        if (v) {
          traceAgent
            .get()
            .getCurrentRootSpan()
            .addLabel(h, v);
        }
      });
      return h.continue;
    });
  },
  name: 'stackdriverLabel'
};

export default plugin;
