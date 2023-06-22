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
          .map((line) => line.quays)
          .flat()
          .filter((i) => i != undefined)
          .filter(
            (element, index, array) =>
              array.findIndex(
                (el) => el?.stopPlace?.id === element?.stopPlace?.id,
              ) === index,
          );
        return Result.ok({lines: [{quays: uniqueHarbors}]});
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
          id: query.id,
        },
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }

      try {
        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
