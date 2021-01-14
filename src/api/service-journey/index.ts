import Hapi from '@hapi/hapi';
import { IServiceJourneyService } from '../../service/interface';
import { ServiceJourneyMapInfoQuery } from '../../service/types';
import { getServiceJoruneyMapDataRequest } from './schema';

export default function serviceJourneyRoutes(server: Hapi.Server) {
  return (service: IServiceJourneyService) => {
    server.route({
      method: 'GET',
      path: '/bff/v1/service-journey/{id}/polyline',
      options: {
        tags: ['api', 'service-joruney'],
        validate: getServiceJoruneyMapDataRequest,
        description: 'Get departures for Service Journey'
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const query = (request.query as unknown) as ServiceJourneyMapInfoQuery;
        return await service.getServiceJourneyMapInfo(id, query);
      }
    });
  };
}
