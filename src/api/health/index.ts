import Hapi from '@hapi/hapi';

export default (server: Hapi.Server) => {
  server.route({
    method: 'GET',
    path: '/bff/health',
    options: {
      description: 'Is the BFF ok?',
      tags: ['api', 'health'],
    },
    handler: () => {
      return 'OK';
    },
  });
  server.route({
    method: 'GET',
    path: '/ws/health',
    options: {
      description: 'Are WebSockets ok?',
      tags: ['api', 'health'],
    },
    handler: () => {
      return 'OK';
    },
  });
};
