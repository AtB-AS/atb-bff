import Hapi from '@hapi/hapi';
import { DEFAULT_CACHE_TTL } from '../../config/cache';
import { EXTERNAL_API_TIMEOUT } from '../../config/external';
import { IServiceJourneyService } from '../../service/interface';
import {
  DeparturesForServiceJourneyQuery, MapLegsQuery,
  ServiceJourneyMapInfoQuery
} from '../../service/types';
import {
  getDeparturesForServiceJourneyRequest,
  getServiceJoruneyMapDataRequest, getMapLegsRequest
} from './schema';
import qs from 'querystring';

export default function serviceJourneyRoutes(server: Hapi.Server) {
  return (service: IServiceJourneyService) => {
    const getServiceJourneyMapInfo = async (
      serviceJouerneyId: string,
      query: ServiceJourneyMapInfoQuery
    ) =>
      (
        await service.getServiceJourneyMapInfo(serviceJouerneyId, query)
      ).unwrap();

    server.method('getServiceJourneyMapInfo', getServiceJourneyMapInfo, {
      generateKey: (
        serviceJouerneyId: string,
        { fromQuayId, toQuayId }: ServiceJourneyMapInfoQuery
      ) => qs.stringify({ serviceJouerneyId, fromQuayId, toQuayId }),
      cache: {
        expiresIn: DEFAULT_CACHE_TTL,
        generateTimeout: EXTERNAL_API_TIMEOUT
      }
    });

    server.route({
      method: 'GET',
      path: '/bff/v1/servicejourney/{id}/polyline',
      options: {
        tags: ['api', 'service-joruney'],
        validate: getServiceJoruneyMapDataRequest,
        description: 'Get departures for Service Journey'
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const query = (request.query as unknown) as ServiceJourneyMapInfoQuery;
        return server.methods.getServiceJourneyMapInfo(id, query);
      }
    });

    server.route({
      method: 'GET',
      path: '/bff/v1/servicejourney/{id}/departures',
      options: {
        tags: ['api', 'stops'],
        validate: getDeparturesForServiceJourneyRequest,
        description: 'Get departures for Service Journey'
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const {
          date
        } = (request.query as unknown) as DeparturesForServiceJourneyQuery;
        return await service.getDeparturesForServiceJourney(id, { date });
      }
    });
  };
}
