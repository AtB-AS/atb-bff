import { Result } from '@badrap/result';
import { formatISO } from 'date-fns';
import { journeyPlannerClient } from '../../../graphql/graphql-client';
import { IServiceJourneyService_v2 } from '../../interface';
import { APIError, ServiceJourneyMapInfoQuery } from '../../types';
import { mapToMapLegs } from './utils';
import {
  getMapInfoWithFromAndToQuay,
  getMapInfoWithFromQuay
} from './serviceJourney';
import {
  ServiceJourneyEstimatedCallFragment,
  ServiceJourneyDeparturesDocument,
  ServiceJourneyDeparturesQuery,
  ServiceJourneyDeparturesQueryVariables
} from './journey-gql/service-journey-departures.graphql-gen';
import {
  ServiceJourneyWithEstimatedCallsDocument,
  ServiceJourneyWithEstimatedCallsQuery,
  ServiceJourneyWithEstimatedCallsQueryVariables
} from './journey-gql/service-journey-with-estimated-calls.graphql-gen';
import { ServiceJourneyWithEstCallsFragment } from '../fragments/journey-gql/service-journey.graphql-gen';
import { ReqRefDefaults, Request } from '@hapi/hapi';

export function serviceJourneyService_v2(): IServiceJourneyService_v2 {
  return {
    async getServiceJourneyMapInfo(
      serviceJourneyId: string,
      query: ServiceJourneyMapInfoQuery,
      headers: Request<ReqRefDefaults>
    ) {
      try {
        const result = query.toQuayId
          ? await getMapInfoWithFromAndToQuay(
              serviceJourneyId,
              query.fromQuayId,
              query.toQuayId,
              headers
            )
          : await getMapInfoWithFromQuay(
              serviceJourneyId,
              query.fromQuayId,
              headers
            );

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        return Result.ok(mapToMapLegs(result.data));
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getDeparturesForServiceJourneyV2(id, { date }, headers) {
      try {
        const serviceDate = date
          ? formatISO(date, { representation: 'date' })
          : undefined;

        const result = await journeyPlannerClient(headers).query<
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
    async getServiceJourneyWithEstimatedCallsV2(id, { date }, headers) {
      try {
        const serviceDate = date
          ? formatISO(date, { representation: 'date' })
          : undefined;

        const result = await journeyPlannerClient(headers).query<
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
