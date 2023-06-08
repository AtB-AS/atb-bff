import Hapi from '@hapi/hapi';

export default (server: Hapi.Server) => {
  server.route({
    method: 'GET',
    path: '/bff/health',
    handler: () => {
      return 'OK';
    },
  });
  server.route({
    method: 'GET',
    path: '/ws/health',
    handler: () => {
      return 'OK';
    },
  });
};
