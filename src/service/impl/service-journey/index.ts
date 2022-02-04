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
      console.log('--- Departures START -------------------------------');
      try {
        let formattedDate = date ? formatISO(date, { representation: 'date' }) : undefined;
        formattedDate = '2022-02-04';
        console.log('id', id);
        console.log('date', formattedDate);
        const departures = await service.getDeparturesForServiceJourney(
          id,
          formattedDate
        );

        //console.log('results', JSON.stringify(departures));
        console.log('--- Departures END ---------------------------------');
        return Result.ok(departures);
      } catch (error) {
        const re = /Entur SDK: No data available/;

        console.log('--- Departures ERROR -------------------------------');
        console.log(error.message);
        if (error.message.match(re)) return Result.ok(null);


        return Result.err(new APIError(error));
      }
    }
  };
}
