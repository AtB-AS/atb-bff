import {Result} from '@badrap/result';
import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {IDeparturesService} from '../../interface';
import {APIError} from '../../../utils/api-error';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables,
} from './journey-gql/stop-departures.graphql-gen';
import {
  NearestStopPlacesDocument,
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from './journey-gql/stops-nearest.graphql-gen';
import {
  StopsDetailsDocument,
  StopsDetailsQuery,
  StopsDetailsQueryVariables,
} from './journey-gql/stops-details.graphql-gen';
import {
  filterStopPlaceFavorites,
  filterFavoriteDepartures,
} from './utils/favorites';
import * as Boom from '@hapi/boom';
import {populateRealtimeCacheIfNotThere} from '../realtime/departure-time';
import {
  DeparturesDocument,
  DeparturesQuery,
  DeparturesQueryVariables,
} from './journey-gql/departures.graphql-gen';
import {mapToLegacyLineName} from './utils/converters';
import {DeparturesWithLineName} from '../../types';

export default (): IDeparturesService => {
  const api: IDeparturesService = {
    async getDepartures(
      {
        ids,
        numberOfDepartures = 1000,
        startTime,
        timeRange = 86400, // 24 hours
        limitPerLine,
      },
      payload,
      headers,
    ) {
      const favorites = payload?.favorites;
      const quayIds = typeof ids === 'string' ? [ids] : ids;
      try {
        const lineIds = favorites?.map((f) => f.lineId);

        /**
         * If favorites are provided, get more departures per quay from journey
         * planner and set limitPerLine instead, since some departures may be
         * filtered out.
         */
        const limit = favorites
          ? {
              limitPerLine: limitPerLine ?? numberOfDepartures,
              numberOfDepartures: Math.min(numberOfDepartures * 10, 1000),
            }
          : {
              limitPerLine,
              numberOfDepartures,
            };

        // Fire and forget population of cache. Not critial if it fails.
        populateRealtimeCacheIfNotThere(
          {
            quayIds,
            startTime,
            lineIds,
            limit: limit.numberOfDepartures,
            limitPerLine: limit.limitPerLine,
            timeRange,
          },
          headers,
        );

        const result = await journeyPlannerClient(headers).query<
          DeparturesQuery,
          DeparturesQueryVariables
        >({
          query: DeparturesDocument,
          variables: {
            ids: quayIds,
            startTime,
            timeRange,
            filterByLineIds: lineIds,
            ...limit,
          },
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        const departuresQueryData = filterFavoriteDepartures(
          result.data,
          favorites,
        );

        const departuresWithLineName: DeparturesWithLineName = {
          ...departuresQueryData,
          quays: departuresQueryData.quays.map((quay) => ({
            ...quay,
            estimatedCalls: quay.estimatedCalls.map((estimatedCall) => ({
              ...estimatedCall,
              lineName: mapToLegacyLineName(estimatedCall.destinationDisplay),
              destinationDisplay: estimatedCall.destinationDisplay,
            })),
          })),
        };

        return Result.ok(departuresWithLineName);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getStopPlacesByPosition(
      {latitude, longitude, distance = 1000, count = 10, after},
      headers,
    ) {
      try {
        const result = await journeyPlannerClient(headers).query<
          NearestStopPlacesQuery,
          NearestStopPlacesQueryVariables
        >({
          query: NearestStopPlacesDocument,
          variables: {
            latitude,
            longitude,
            distance,
            after,
            count,
          },
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },

    async getStopsDetails({ids}, headers) {
      try {
        const result = await journeyPlannerClient(headers).query<
          StopsDetailsQuery,
          StopsDetailsQueryVariables
        >({
          query: StopsDetailsDocument,
          variables: {
            ids,
          },
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }
        if (!result.data.stopPlaces.filter(Boolean).length) {
          return Result.err(
            Boom.resourceGone(
              'Stop place not found or no longer available. (No matching stop places)',
            ),
          );
        }
        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getStopQuayDepartures(
      {id, numberOfDepartures = 10, startTime, timeRange, limitPerLine},
      headers,
      payload,
    ) {
      const favorites = payload?.favorites;
      try {
        /**
         * If favorites are provided, get more departures per quay from journey
         * planner and set limitPerLine instead, since some departures may be
         * filtered out.
         */
        const limit = favorites
          ? {
              limitPerLine: limitPerLine ?? numberOfDepartures,
              numberOfDepartures: numberOfDepartures * 10,
            }
          : {
              limitPerLine,
              numberOfDepartures,
            };
        const lineIds = favorites?.map((f) => f.lineId);

        const result = await journeyPlannerClient(headers).query<
          StopPlaceQuayDeparturesQuery,
          StopPlaceQuayDeparturesQueryVariables
        >({
          query: StopPlaceQuayDeparturesDocument,
          variables: {
            id,
            startTime,
            timeRange,
            filterByLineIds: lineIds,
            ...limit,
          },
        });

        const quayIds = result.data.stopPlace?.quays?.map((q) => q.id);
        if (quayIds) {
          // Fire and forget population of cache. Not critial if it fails.
          populateRealtimeCacheIfNotThere(
            {
              quayIds,
              startTime,
              lineIds,
              limit: limit.numberOfDepartures,
              limitPerLine: limit.limitPerLine,
              timeRange,
            },
            headers,
          );
        }

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        const data = filterStopPlaceFavorites(
          result.data,
          favorites,
          numberOfDepartures,
        );

        return Result.ok(data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };

  return api;
};
