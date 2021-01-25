import { Result } from '@badrap/result';
import client from '../../../graphql/graphql-client';
import { IServiceJourneyService } from '../../interface';
import { APIError, ServiceJourneyMapInfoQuery } from '../../types';
import {
  MapInfoByServiceJourneyIdDocument,
  MapInfoByServiceJourneyIdQuery,
  MapInfoByServiceJourneyIdQueryVariables
} from './service-journey-map.graphql-gen';
import { mapToMapLegs } from './utils';

export default function serviceJourneyService(): IServiceJourneyService {
  return {
    async getServiceJourneyMapInfo(
      serviceJourneyId: string,
      query: ServiceJourneyMapInfoQuery
    ) {
      try {
        const variables: MapInfoByServiceJourneyIdQueryVariables = {
          serviceJourneyId,
          currentQuayId: query.currentQuayId
        };
        const result = await client.query<
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
