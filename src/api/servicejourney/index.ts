import Hapi from '@hapi/hapi';
import { DEFAULT_CACHE_TTL } from '../../config/cache';
import { EXTERNAL_API_TIMEOUT } from '../../config/external';
import {
  IServiceJourneyService,
  IServiceJourneyService_v2
} from '../../service/interface';
import {
  DeparturesForServiceJourneyQuery,
  ServiceJourneyMapInfoQuery, ServiceJourneyWithEstimatedCallsQuery
} from '../../service/types';
import {
  getDeparturesForServiceJourneyRequest,
  getDeparturesForServiceJourneyRequestV2,
  getServiceJoruneyMapDataRequest, getServiceJourneyWithEstimatedCallsV2
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

export function serviceJourneyRoutes_v2(server: Hapi.Server) {
  return (service: IServiceJourneyService_v2) => {
    const getServiceJourneyMapInfo_v2 = async (
      serviceJouerneyId: string,
      query: ServiceJourneyMapInfoQuery
    ) =>
      (
        await service.getServiceJourneyMapInfo(serviceJouerneyId, query)
      ).unwrap();

    server.method('getServiceJourneyMapInfo_v2', getServiceJourneyMapInfo_v2, {
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
      path: '/bff/v2/servicejourney/{id}/polyline',
      options: {
        tags: ['api', 'service-journey', 'map'],
        validate: getServiceJoruneyMapDataRequest,
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
        return await service.getServiceJourneyWithEstimatedCallsV2(id, { date });
      }
    });
  };
}
