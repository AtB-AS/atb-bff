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
import {QuayFragment} from '../fragments/journey-gql/quays.graphql-gen';
import {JourneyPatternsFragment} from '../fragments/journey-gql/journey-pattern.graphql-gen';
import {
  TransportMode,
  TransportSubmode,
} from '../../../graphql/journey/journeyplanner-types_v3';
import {
  GetStopPlaceParentDocument,
  GetStopPlaceParentQuery,
  GetStopPlaceParentQueryVariables,
} from './journey-gql/stop-place-parent.graphql-gen';

export default (): IStopPlacesService => {
  return {
    async getStopPlacesByMode(query, headers) {
      /**
       * Temporary flag to include ferry submode in the stop places query
       * so that we have an backward compatible way to show ferry stop places
       * when buying express boat tickets in the Svipper app.
       * This flag should be removed once we have enough users on app
       * version > v1.56
       */
      if (
        (!headers.appVersion || headers.appVersion <= '1.55') &&
        process.env.INCLUDE_CAR_FERRY_SUBMODE_STOP_PLACES_QUERY === 'true'
      ) {
        query.transportSubmodes?.push(TransportSubmode.LocalCarFerry);
      }
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
            filterTransportModes(
              {submodes: query.transportSubmodes},
              undefined,
              line.transportSubmode,
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
        .filter((jp) => filterAuthorities(jp, query.authorities))
        .filter((jp) =>
          filterTransportModes(
            {modes: query.transportModes, submodes: query.transportSubmodes},
            jp.line.transportMode,
            jp.line.transportSubmode,
          ),
        );

      const reachableQuays = journeyPatternsWithMatchingAuthority.flatMap(
        (jp) => getReachableQuays(jp.quays, query.fromStopPlaceId),
      );

      const reachableStopPlaces = reachableQuays.map((quay) => quay.stopPlace);

      const uniqueStopPlaces = reachableStopPlaces
        .filter(isDefined)
        .filter(onlyUniquesBasedOnField('id'));

      try {
        return Result.ok(uniqueStopPlaces ?? []);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getStopPlaceParent(query, headers) {
      const result = await journeyPlannerClient(headers).query<
        GetStopPlaceParentQuery,
        GetStopPlaceParentQueryVariables
      >({
        query: GetStopPlaceParentDocument,
        variables: {
          id: query.id,
        },
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      const parentStopPlaceId = result.data.stopPlace?.parent?.id;

      // found parent stop ID
      if (parentStopPlaceId) {
        return Result.ok(parentStopPlaceId);
      }

      // sent ID is parent stop place
      if (result.data.stopPlace) {
        return Result.ok(result.data.stopPlace?.id);
      }

      return Result.err(new Error('Invalid stop place ID'));
    },
  };
};

function filterAuthorities(
  journeyPattern: JourneyPatternsFragment,
  authorities: string[],
) {
  return authorities.some(
    (authority) => journeyPattern.line.authority?.id === authority,
  );
}

function filterTransportModes(
  filter: {
    modes?: TransportMode[];
    submodes?: TransportSubmode[];
  },
  mode?: TransportMode,
  submode?: TransportSubmode,
) {
  const isOneOfModes = filter.modes
    ? filter.modes.some((m) => mode === m)
    : true;
  const isOneOfSubmodes = filter.submodes
    ? filter.submodes.some((sm) => submode === sm)
    : true;
  return isOneOfModes && isOneOfSubmodes;
}

function getReachableQuays(quays: QuayFragment[], fromStopPlaceId: string) {
  const index = quays.findIndex(
    (quay) => quay.stopPlace?.id === fromStopPlaceId,
  );
  const reachableQuaysOnLine = quays.slice(index + 1);
  const reachableQuaysOnLineWithoutFromStopPlace = reachableQuaysOnLine.filter(
    (quay) => quay.stopPlace?.id !== fromStopPlaceId,
  );
  return reachableQuaysOnLineWithoutFromStopPlace;
}
