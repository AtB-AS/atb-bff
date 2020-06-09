import Hapi from '@hapi/hapi';

interface Options {
}

const plugin: Hapi.Plugin<Options> = {
  name: 'atb-headers',
  register: (server, _) => {
    const installId = (request: Hapi.Request) =>
      request.headers['atb-install-id'] || '';
    const requestId = (request: Hapi.Request) =>
      request.headers['atb-request-id'] || '';
    server.decorate('request', 'installId', installId, { apply: true });
    server.decorate('request', 'requestId', requestId, { apply: true });
  }
};

export default plugin;
