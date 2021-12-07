import Hapi from '@hapi/hapi';
import { ITrips_v3 } from '../../service/interface';
import { TripsQueryVariables } from '../../types/trips';
import { postTripsRequest } from './schema';

export default (server: Hapi.Server) => (service: ITrips_v3) => {
  server.route({
    method: 'POST',
    path: '/bff/v2/trips',
    options: {
      tags: ['api', 'trips'],
      description: 'Get trips between stops',
      validate: postTripsRequest
    },

    handler: async (request, h) => {
      const query = (request.payload as unknown) as TripsQueryVariables;
      const result = await service.getTrips(query);
      const unwrapped = result.unwrap();
      console.log(unwrapped);
      return unwrapped;
    }
  });
};
