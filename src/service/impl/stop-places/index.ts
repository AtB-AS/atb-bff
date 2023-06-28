import {IStopPlacesService} from '../../interface';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {Result} from '@badrap/result';
import {
  GetStopPlaceConnectionsDocument,
  GetStopPlaceConnectionsQuery,
  GetStopPlaceConnectionsQueryVariables,
} from './journey-gql/stop-place-connections.graphql-gen';
import {isDefined, onlyUniquesBasedOnField} from './utils';
import {APIError} from '../../../utils/api-error';
import {
  GetStopPlacesByModeDocument,
  GetStopPlacesByModeQuery,
  GetStopPlacesByModeQueryVariables,
} from './journey-gql/stop-places-mode.graphql-gen';
import {StopPlaceConnectionsQuery} from '../../types';
import {QuayFragment} from '../fragments/journey-gql/quays.graphql-gen';
import {JourneyPatternsFragment} from '../fragments/journey-gql/journey-pattern.graphql-gen';

export default (): IStopPlacesService => {
  return {
    async getStopPlacesByMode(query, headers) {
      const result = await journeyPlannerClient(headers).query<
        GetStopPlacesByModeQuery,
        GetStopPlacesByModeQueryVariables
      >({
        query: GetStopPlacesByModeDocument,
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
          id: query.fromStopPlaceId,
        },
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      if (!result.data.stopPlace?.quays) {
        return Result.ok([]);
      }
      const journeyPatternsWithMatchingAuthority = result.data.stopPlace.quays
        .flatMap((quay) => quay.journeyPatterns)
        .filter((jp) => filterAuthorities(jp, query));

      const reachableQuays = journeyPatternsWithMatchingAuthority.flatMap(
        (jp) => filterPreviousStops(jp.quays, query),
      );

      const stopPlaces = reachableQuays.map((quay) => quay.stopPlace);

      const uniqueStopPlaces = stopPlaces
        .filter(isDefined)
        .filter(onlyUniquesBasedOnField('id'));

      try {
        return Result.ok(uniqueStopPlaces ?? []);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};

function filterAuthorities(
  journeyPattern: JourneyPatternsFragment,
  query: StopPlaceConnectionsQuery,
) {
  const matchingAuthority = query.authorities.find(
    (authority) => journeyPattern.line.authority?.id === authority,
  );
  return !!matchingAuthority;
}

function filterPreviousStops(
  quays: QuayFragment[],
  query: StopPlaceConnectionsQuery,
) {
  const index = quays.findIndex(
    (quay) => quay.stopPlace?.id === query.fromStopPlaceId,
  );
  return quays.slice(index + 1);
}
