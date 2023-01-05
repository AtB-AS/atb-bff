import { Result } from '@badrap/result';
import { formatISO } from 'date-fns';
import {
  journeyPlannerClient,
  journeyPlannerClient_v3
} from '../../../graphql/graphql-client';
import {
  IServiceJourneyService,
  IServiceJourneyService_v2
} from '../../interface';
import { APIError, ServiceJourneyMapInfoQuery } from '../../types';
import { EnturServiceAPI } from '../entur';
import {
  MapInfoByServiceJourneyIdDocument,
  MapInfoByServiceJourneyIdQuery,
  MapInfoByServiceJourneyIdQueryVariables
} from './journey-gql/jp2/service-journey-map.graphql-gen';
import { mapToMapLegs } from './utils';
import { mapToMapLegs_v3 } from './utils_v3';
import {
  getMapInfoWithFromAndToQuay,
  getMapInfoWithFromQuay
} from './serviceJourney';
import {
  ServiceJourneyEstimatedCallFragment,
  ServiceJourneyDeparturesDocument,
  ServiceJourneyDeparturesQuery,
  ServiceJourneyDeparturesQueryVariables
} from './journey-gql/jp3/service-journey-departures.graphql-gen';
import {
  ServiceJourneyWithEstimatedCallsDocument,
  ServiceJourneyWithEstimatedCallsQuery,
  ServiceJourneyWithEstimatedCallsQueryVariables
} from './journey-gql/jp3/service-journey-with-estimated-calls.graphql-gen';
import { ServiceJourneyWithEstCallsFragment } from '../fragments/jp3/service-journey.graphql-gen';

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
    }
  };
}

export function serviceJourneyService_v2(): IServiceJourneyService_v2 {
  return {
    async getServiceJourneyMapInfo(
      serviceJourneyId: string,
      query: ServiceJourneyMapInfoQuery
    ) {
      try {
        const result = query.toQuayId
          ? await getMapInfoWithFromAndToQuay(
              serviceJourneyId,
              query.fromQuayId,
              query.toQuayId
            )
          : await getMapInfoWithFromQuay(serviceJourneyId, query.fromQuayId);

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        return Result.ok(mapToMapLegs_v3(result.data));
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getDeparturesForServiceJourneyV2(id, { date }) {
      try {
        const serviceDate = date
          ? formatISO(date, { representation: 'date' })
          : undefined;

        const result = await journeyPlannerClient_v3.query<
          ServiceJourneyDeparturesQuery,
          ServiceJourneyDeparturesQueryVariables
        >({
          query: ServiceJourneyDeparturesDocument,
          variables: { id, date: serviceDate }
        });

        if (result.error) {
          return Result.err(new APIError(result.error));
        }

        const estimatedCalls = result.data.serviceJourney?.estimatedCalls;
        return Result.ok(
          estimatedCalls as ServiceJourneyEstimatedCallFragment[]
        );
      } catch (error: any) {
        return Result.err(new APIError(error));
      }
    },
    async getServiceJourneyWithEstimatedCallsV2(id, { date }) {
      try {
        const serviceDate = date
          ? formatISO(date, { representation: 'date' })
          : undefined;

        const result = await journeyPlannerClient_v3.query<
          ServiceJourneyWithEstimatedCallsQuery,
          ServiceJourneyWithEstimatedCallsQueryVariables
        >({
          query: ServiceJourneyWithEstimatedCallsDocument,
          variables: { id, date: serviceDate }
        });

        if (result.error) {
          return Result.err(new APIError(result.error));
        }

        const serviceJourney = result.data.serviceJourney;
        return Result.ok(serviceJourney as ServiceJourneyWithEstCallsFragment);
      } catch (error: any) {
        return Result.err(new APIError(error));
      }
    }
  };
}
