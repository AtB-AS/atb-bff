import Hapi from '@hapi/hapi';
import {CACHE_TTL_MS_SERVER_SERVICE_JOURNEY_MAP_INFO} from '../../config/env';
import {IServiceJourneyService_v2} from '../../service/interface';
import {
  DeparturesForServiceJourneyQuery,
  ServiceJourneyMapInfoQuery,
  ServiceJourneyWithEstimatedCallsQuery,
} from '../../service/types';
import {
  getDeparturesForServiceJourneyRequestV2,
  getServiceJourneyMapDataRequest,
  getServiceJourneyWithEstimatedCallsV2,
} from './schema';
import qs from 'querystring';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {getServerCache} from '../../utils/cache';

export function serviceJourneyRoutes_v2(server: Hapi.Server) {
  return (service: IServiceJourneyService_v2) => {
    const getServiceJourneyMapInfo_v2 = async (
      serviceJourneyId: string,
      query: ServiceJourneyMapInfoQuery,
      headers: Request<ReqRefDefaults>,
    ) =>
      (
        await service.getServiceJourneyMapInfo(serviceJourneyId, query, headers)
      ).unwrap();

    server.method('getServiceJourneyMapInfo_v2', getServiceJourneyMapInfo_v2, {
      generateKey: (
        serviceJourneyId: string,
        {fromQuayId, toQuayId}: ServiceJourneyMapInfoQuery,
      ) =>
        qs.stringify({
          serviceJourneyId: serviceJourneyId,
          fromQuayId,
          toQuayId,
        }),
      cache: getServerCache(CACHE_TTL_MS_SERVER_SERVICE_JOURNEY_MAP_INFO),
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
            deprecated: true,
          },
        },
      },
      handler: async (request, h) => {
        const {id} = request.params;
        const query = request.query as unknown as ServiceJourneyMapInfoQuery;
        return server.methods.getServiceJourneyMapInfo_v2(id, query, h.request);
      },
    });

    server.route({
      method: 'GET',
      path: '/bff/v2/servicejourney/{id}/polyline',
      options: {
        tags: ['api', 'service-journey', 'map'],
        validate: getServiceJourneyMapDataRequest,
        description: 'Get departures for Service Journey',
      },
      handler: async (request, h) => {
        const {id} = request.params;
        const query = request.query as unknown as ServiceJourneyMapInfoQuery;
        return server.methods.getServiceJourneyMapInfo_v2(id, query, h.request);
      },
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
            deprecated: true,
          },
        },
      },
      handler: async (request, h) => {
        const {id} = request.params;
        const {date} =
          request.query as unknown as DeparturesForServiceJourneyQuery;
        return await service.getDeparturesForServiceJourneyV2(
          id,
          {
            date,
          },
          h.request,
        );
      },
    });

    server.route({
      method: 'GET',
      path: '/bff/v2/servicejourney/{id}/departures',
      options: {
        tags: ['api', 'stops', 'otp2'],
        validate: getDeparturesForServiceJourneyRequestV2,
        description: 'Get departures for Service Journey',
      },
      handler: async (request, h) => {
        const {id} = request.params;
        const {date} =
          request.query as unknown as DeparturesForServiceJourneyQuery;
        return await service.getDeparturesForServiceJourneyV2(
          id,
          {date},
          h.request,
        );
      },
    });

    server.route({
      method: 'GET',
      path: '/bff/v2/servicejourney/{id}/calls',
      options: {
        tags: ['api', 'stops', 'otp2'],
        validate: getServiceJourneyWithEstimatedCallsV2,
        description: 'Get Service Journey including its estimated calls',
      },
      handler: async (request, h) => {
        const {id} = request.params;
        const {date} =
          request.query as unknown as ServiceJourneyWithEstimatedCallsQuery;
        return await service.getServiceJourneyWithEstimatedCallsV2(
          id,
          {
            date,
          },
          h.request,
        );
      },
    });
  };
}
