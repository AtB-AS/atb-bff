import {IStopPlacesService} from '../../interface';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {Result} from '@badrap/result';
import {APIError} from '../../types';
import {
  GetHarborsDocument,
  GetHarborsQuery,
  GetHarborsQueryVariables,
} from './journey-gql/lines.graphql-gen';
import {
  GetStopPlaceDocument,
  GetStopPlaceQuery,
  GetStopPlaceQueryVariables,
} from './journey-gql/stop-place.graphql-gen';
import {TransportSubmode} from '../../../graphql/journey/journeyplanner-types_v3';

export default (): IStopPlacesService => {
  return {
    async getHarbors(query, headers) {
      const result = await journeyPlannerClient(headers).query<
        GetHarborsQuery,
        GetHarborsQueryVariables
      >({
        query: GetHarborsDocument,
        variables: {
          authorities: query.authorities,
        },
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }

      try {
        const uniqueHarbors = result.data.lines
          .filter((line) => {
            return (
              line.transportSubmode ===
                TransportSubmode.HighSpeedPassengerService ||
              line.transportSubmode === TransportSubmode.HighSpeedVehicleService
            );
          })
          .map((line) => line.quays)
          .flat()
          .filter(
            (element, index, array) =>
              array.findIndex(
                (el) => el?.stopPlace?.id === element?.stopPlace?.id,
              ) === index,
          );
        return Result.ok(uniqueHarbors);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getStopPlace(query, headers) {
      const result = await journeyPlannerClient(headers).query<
        GetStopPlaceQuery,
        GetStopPlaceQueryVariables
      >({
        query: GetStopPlaceDocument,
        variables: {
          id: query.fromHarborId,
        },
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      const uniqueHarbors = result.data.stopPlace?.quays
        ?.map((line) => line.journeyPatterns)
       .map((journeyPattern) => journeyPattern.quays)
        .flat()
        .filter(
          (element, index, array) =>
            array.findIndex(
              (el) => el?.stopPlace?.id === element?.stopPlace?.id,
            ) === index,
        );
      if (!uniqueHarbors || !uniqueHarbors.length) {
        return Result.err(new APIError(result.errors));
      }
      console.log(uniqueHarbors);
      try {
        return Result.ok(uniqueHarbors);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
