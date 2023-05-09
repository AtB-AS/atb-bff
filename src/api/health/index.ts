import Hapi from '@hapi/hapi';

export default (server: Hapi.Server) => {
  server.route({
    method: 'GET',
    path: '/bff/health',
    handler: (request, h, err) => {
      return 'OK';
    }
  });
  server.route({
    method: 'GET',
    path: '/ws/health',
    handler: (request, h, err) => {
      return 'OK';
    }
  });
};
