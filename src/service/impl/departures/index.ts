import { Result } from '@badrap/result';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
import { IDeparturesService } from '../../interface';
import { APIError, DepartureRealtimeQuery } from '../../types';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables
} from './gql/jp3/stop-departures.graphql-gen';
import { getRealtimeDepartureTime } from '../stops/departure-time';
import {
  QuayDeparturesDocument,
  QuayDeparturesQuery,
  QuayDeparturesQueryVariables
} from './gql/jp3/quay-departures.graphql-gen';
import {
  NearestStopPlacesDocument,
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables
} from './gql/jp3/stops-nearest.graphql-gen';
import {
  StopsDetailsDocument,
  StopsDetailsQuery,
  StopsDetailsQueryVariables
} from './gql/jp3/stops-details.graphql-gen';
import {
  filterStopPlaceFavorites,
  filterQuayFavorites
} from './utils/favorites';

export default (): IDeparturesService => {
  const api: IDeparturesService = {
    async getStopPlacesByPosition({
      latitude,
      longitude,
      distance = 1000,
      count = 10,
      after
    }) {
      try {
        const result = await journeyPlannerClient_v3.query<
          NearestStopPlacesQuery,
          NearestStopPlacesQueryVariables
        >({
          query: NearestStopPlacesDocument,
          variables: {
            latitude,
            longitude,
            distance,
            after,
            count
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },

    async getStopsDetails({ ids }) {
      try {
        const result = await journeyPlannerClient_v3.query<
          StopsDetailsQuery,
          StopsDetailsQueryVariables
        >({
          query: StopsDetailsDocument,
          variables: {
            ids
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getStopQuayDepartures(
      { id, numberOfDepartures = 10, startTime, timeRange, limitPerLine },
      payload
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
              limitPerLine: numberOfDepartures,
              numberOfDepartures: numberOfDepartures * 10
            }
          : { numberOfDepartures: numberOfDepartures };

        const result = await journeyPlannerClient_v3.query<
          StopPlaceQuayDeparturesQuery,
          StopPlaceQuayDeparturesQueryVariables
        >({
          query: StopPlaceQuayDeparturesDocument,
          variables: {
            id,
            startTime,
            timeRange,
            filterByLineIds: favorites?.map(f => f.lineId),
            limitPerLine,
            ...limit,
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        const data = filterStopPlaceFavorites(
          result.data,
          favorites,
          numberOfDepartures
        );

        return Result.ok(data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getQuayDepartures(
      {
        id,
        numberOfDepartures = 1000,
        startTime,
        timeRange = 86400, // 24 hours
        limitPerLine
      },
      payload
    ) {
      const favorites = payload?.favorites;
      try {
        const result = await journeyPlannerClient_v3.query<
          QuayDeparturesQuery,
          QuayDeparturesQueryVariables
        >({
          query: QuayDeparturesDocument,
          variables: {
            id,
            numberOfDepartures,
            startTime,
            timeRange,
            filterByLineIds: favorites?.map(f => f.lineId),
            limitPerLine
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        const data = filterQuayFavorites(result.data, favorites);

        return Result.ok(data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getDepartureRealtime(query: DepartureRealtimeQuery) {
      return getRealtimeDepartureTime(query, journeyPlannerClient_v3);
    }
  };

  return api;
};
