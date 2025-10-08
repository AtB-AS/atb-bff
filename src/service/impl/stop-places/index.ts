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
import {StopPlaces} from '../../types';
import {getDistancesResult} from '../../../api/stop-places/schema';
import {DistancesResult} from '../../../api/stop-places/types';
import Joi from 'joi';

export default (): IStopPlacesService => {
  return {
    async getStopPlacesByMode(query, request) {
      const result = await journeyPlannerClient(request).query<
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
    async getStopPlaceConnections(query, request) {
      const result = await journeyPlannerClient(request).query<
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
    async getStopPlaceParent(query, request) {
      const result = await journeyPlannerClient(request).query<
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
    async getStopPlaceDistances(query, request) {
      // This is only a POC in staging. OrgId 18 is Reis Nordland and for testing purposes only.
      const distances = await fetch(
        `https://api.staging.entur.io/distance/stop-place-distances/reachable/${query.fromStopPlaceId}?organisationId=18`,
      ).then((data) => data.json());
      const validationResult: Joi.ValidationResult<DistancesResult> =
        getDistancesResult.validate(distances);
      const error = validationResult.error;
      if (error) return Result.err(new APIError(error));

      const reachableStopPlaceIds = Object.keys(validationResult.value);

      const allStopPlaces = (
        await this.getStopPlacesByMode(
          {
            authorities: query.authorities,
            transportModes: query.transportModes ?? [],
            transportSubmodes: query.transportSubmodes ?? undefined,
          },
          request,
        )
      ).unwrap();

      const reachableStopPlaces: StopPlaces = reachableStopPlaceIds
        .map((spId) => allStopPlaces.find((asp) => asp.id === spId))
        .filter(isDefined);

      return Result.ok(reachableStopPlaces);
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
