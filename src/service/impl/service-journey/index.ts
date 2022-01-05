import { Result } from '@badrap/result';
import { formatISO } from 'date-fns';
import { journeyPlannerClient } from '../../../graphql/graphql-client';
import { IServiceJourneyService } from '../../interface';
import { APIError, ServiceJourneyMapInfoQuery } from '../../types';
import { EnturServiceAPI } from '../entur';
import {
  MapInfoByServiceJourneyIdDocument,
  MapInfoByServiceJourneyIdQuery,
  MapInfoByServiceJourneyIdQueryVariables
} from './journey-gql/jp2/service-journey-map.graphql-gen';
import { mapToMapLegs } from './utils';

export default function serviceJourneyService(
  service: EnturServiceAPI
): IServiceJourneyService {
  return {
    async getServiceJourneyMapInfo(
      serviceJourneyId: string,
      query: ServiceJourneyMapInfoQuery
    ) {
      try {
        const variables: MapInfoByServiceJourneyIdQueryVariables = {
          serviceJourneyId,
          fromQuayId: query.fromQuayId ?? '',
          toQuayId: query.toQuayId ?? ''
        };

        const result = await journeyPlannerClient.query<
          MapInfoByServiceJourneyIdQuery,
          MapInfoByServiceJourneyIdQueryVariables
        >({
          query: MapInfoByServiceJourneyIdDocument,
          variables,
          fetchPolicy: 'cache-first'
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        return Result.ok(mapToMapLegs(result.data));
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getDeparturesForServiceJourney(id, { date }) {
      try {
        const departures = await service.getDeparturesForServiceJourney(
          id,
          date ? formatISO(date, { representation: 'date' }) : undefined
        );

        return Result.ok(departures);
      } catch (error) {
        const re = /Entur SDK: No data available/;
        if (error.message.match(re)) return Result.ok(null);

        return Result.err(new APIError(error));
      }
    }
  };
}

export function serviceJourneyService_v3(
  service: EnturServiceAPI
): IServiceJourneyService {
  return {
    async getServiceJourneyMapInfo(
      serviceJourneyId: string,
      query: ServiceJourneyMapInfoQuery
    ) {
      try {
        const variables: MapInfoByServiceJourneyIdQueryVariables = {
          serviceJourneyId,
          fromQuayId: query.fromQuayId ?? '',
          toQuayId: query.toQuayId ?? ''
        };

        const result = await journeyPlannerClient.query<
          MapInfoByServiceJourneyIdQuery,
          MapInfoByServiceJourneyIdQueryVariables
          >({
          query: MapInfoByServiceJourneyIdDocument,
          variables,
          fetchPolicy: 'cache-first'
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        return Result.ok(mapToMapLegs(result.data));
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getDeparturesForServiceJourney(id, { date }) {
      try {
        const departures = await service.getDeparturesForServiceJourney(
          id,
          date ? formatISO(date, { representation: 'date' }) : undefined
        );

        return Result.ok(departures);
      } catch (error) {
        const re = /Entur SDK: No data available/;
        if (error.message.match(re)) return Result.ok(null);

        return Result.err(new APIError(error));
      }
    }
  };
}

