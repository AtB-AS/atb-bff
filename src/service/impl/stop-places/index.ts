import {IStopPlacesService} from '../../interface';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {Result} from '@badrap/result';
import {
  GetStopPlaceConnectionsDocument,
  GetStopPlaceConnectionsQuery,
  GetStopPlaceConnectionsQueryVariables,
} from './journey-gql/stop-place-connections.graphql-gen';
import {
  GetStopPlacesDocument,
  GetStopPlacesQuery,
  GetStopPlacesQueryVariables,
} from './journey-gql/stop-places.graphql-gen';
import {isDefined, onlyUniquesBasedOnField} from './utils';
import {APIError} from '../../../utils/api-error';

export default (): IStopPlacesService => {
  return {
    async getStopPlaces(query, headers) {
      const result = await journeyPlannerClient(headers).query<
        GetStopPlacesQuery,
        GetStopPlacesQueryVariables
      >({
        query: GetStopPlacesDocument,
        variables: {
          authorities: query.authorities,
          transportModes: query.transportModes,
        },
      });

      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }

      try {
        const uniqueStopPlaces = result.data.lines
          .filter((line) =>
            query.transportSubmodes?.find(
              (subMode) => subMode === line.transportSubmode,
            ),
          )
          .flatMap((line) => line.quays)
          .map((quay) => quay.stopPlace)
          .filter(isDefined)
          .filter(onlyUniquesBasedOnField('id'));
        return Result.ok(uniqueStopPlaces);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getStopPlaceConnections(query, headers) {
      const result = await journeyPlannerClient(headers).query<
        GetStopPlaceConnectionsQuery,
        GetStopPlaceConnectionsQueryVariables
      >({
        query: GetStopPlaceConnectionsDocument,
        variables: {
          id: query.fromHarborId,
        },
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      const uniqueStopPlaces = result.data.stopPlace?.quays
        ?.flatMap((quay) => quay.journeyPatterns)
        .flatMap((journeyPattern) => journeyPattern.quays)
        .map((quay) => quay.stopPlace)
        .filter(isDefined)
        .filter(onlyUniquesBasedOnField('id'));
      if (!uniqueStopPlaces || !uniqueStopPlaces.length) {
        return Result.err(new APIError(result.errors));
      }
      try {
        return Result.ok(uniqueStopPlaces);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
