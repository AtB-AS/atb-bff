import Hapi from '@hapi/hapi';
import { DEFAULT_CACHE_TTL } from '../../config/cache';
import { EXTERNAL_API_TIMEOUT } from '../../config/external';
import { IServiceJourneyService_v2 } from '../../service/interface';
import {
  DeparturesForServiceJourneyQuery,
  ServiceJourneyMapInfoQuery,
  ServiceJourneyWithEstimatedCallsQuery
} from '../../service/types';
import {
  getDeparturesForServiceJourneyRequestV2,
  getServiceJourneyMapDataRequest,
  getServiceJourneyWithEstimatedCallsV2
} from './schema';
import qs from 'querystring';

export function serviceJourneyRoutes_v2(server: Hapi.Server) {
  return (service: IServiceJourneyService_v2) => {
    const getServiceJourneyMapInfo_v2 = async (
      serviceJourneyId: string,
      query: ServiceJourneyMapInfoQuery
    ) =>
      (
        await service.getServiceJourneyMapInfo(serviceJourneyId, query)
      ).unwrap();

    server.method('getServiceJourneyMapInfo_v2', getServiceJourneyMapInfo_v2, {
      generateKey: (
        serviceJourneyId: string,
        { fromQuayId, toQuayId }: ServiceJourneyMapInfoQuery
      ) =>
        qs.stringify({
          serviceJourneyId: serviceJourneyId,
          fromQuayId,
          toQuayId
        }),
      cache: {
        expiresIn: DEFAULT_CACHE_TTL,
        generateTimeout: EXTERNAL_API_TIMEOUT
      }
    });

    server.route({
      method: 'GET',
      path: '/bff/v1/servicejourney/{id}/polyline',
      options: {
        tags: ['api', 'service-journey'],
        validate: getServiceJourneyMapDataRequest,
        description: 'Get departures for Service Journey',
        plugins: {
          'hapi-swagger': {
            deprecated: true
          }
        }
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const query = (request.query as unknown) as ServiceJourneyMapInfoQuery;
        return server.methods.getServiceJourneyMapInfo_v2(id, query);
      }
    });

    server.route({
      method: 'GET',
      path: '/bff/v2/servicejourney/{id}/polyline',
      options: {
        tags: ['api', 'service-journey', 'map'],
        validate: getServiceJourneyMapDataRequest,
        description: 'Get departures for Service Journey'
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const query = (request.query as unknown) as ServiceJourneyMapInfoQuery;
        return server.methods.getServiceJourneyMapInfo_v2(id, query);
      }
    });

    server.route({
      method: 'GET',
      path: '/bff/v1/servicejourney/{id}/departures',
      options: {
        tags: ['api', 'stops'],
        validate: getDeparturesForServiceJourneyRequestV2,
        description: 'Get departures for Service Journey',
        plugins: {
          'hapi-swagger': {
            deprecated: true
          }
        }
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const {
          date
        } = (request.query as unknown) as DeparturesForServiceJourneyQuery;
        return await service.getDeparturesForServiceJourneyV2(id, {
          date
        });
      }
    });

    server.route({
      method: 'GET',
      path: '/bff/v2/servicejourney/{id}/departures',
      options: {
        tags: ['api', 'stops', 'otp2'],
        validate: getDeparturesForServiceJourneyRequestV2,
        description: 'Get departures for Service Journey'
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const {
          date
        } = (request.query as unknown) as DeparturesForServiceJourneyQuery;
        return await service.getDeparturesForServiceJourneyV2(id, { date });
      }
    });

    server.route({
      method: 'GET',
      path: '/bff/v2/servicejourney/{id}/calls',
      options: {
        tags: ['api', 'stops', 'otp2'],
        validate: getServiceJourneyWithEstimatedCallsV2,
        description: 'Get Service Journey including its estimated calls'
      },
      handler: async (request, h) => {
        const { id } = request.params;
        const {
          date
        } = (request.query as unknown) as ServiceJourneyWithEstimatedCallsQuery;
        return await service.getServiceJourneyWithEstimatedCallsV2(id, {
          date
        });
      }
    });
  };
}
