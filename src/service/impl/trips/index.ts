import {ITrips_v2} from '../../interface';

import {Result} from '@badrap/result';
import {TripsQueryWithJourneyIds} from '../../../types/trips';
import {APIError} from '../../../utils/api-error';
import {mapQueryToLegacyTripPatterns} from './converters';
import {getSingleTrip, getTrips} from './trips';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {TripsQueryVariables} from './journey-gql/trip.graphql-gen';
import {StreetMode} from '../../../graphql/journey/journeyplanner-types_v3';

export default (): ITrips_v2 => {
  const api: ITrips_v2 = {
    async getTrips(query, headers: Request<ReqRefDefaults>) {
      return getTrips(query, headers);
    },

    async getNonTransitTrips(query, headers) {
      const queries = query.modes.map((mode) => toTripsQuery(query, mode, 1));
      return Promise.all(
        queries.map((query) =>
          getTrips(query, headers).then((result) => ({
            mode: query.modes.directMode,
            result,
          })),
        ),
      ).then((allTrips) => {
        if (allTrips.some((t) => t.result.isErr))
          return Result.err(new Error('Something is foobar'));
        return Result.ok(
          allTrips.map((t) => {
            const res = t.result.unwrap();
            return {
              mode: t.mode,
              trip: res.trip.tripPatterns.length ? res.trip : undefined,
            };
          }),
        );
      });
    },

    async getSingleTrip(
      queryWithIds: TripsQueryWithJourneyIds,
      headers: Request<ReqRefDefaults>,
    ) {
      return getSingleTrip(queryWithIds, headers);
    },
    async getTripPatterns(query, headers) {
      try {
        const trips = await getTrips(
          {
            from: query.from,
            to: query.to,
            arriveBy: query.arriveBy,
            when: query.searchDate,
          },
          headers,
        );

        if (trips.isErr) {
          return Result.err(new APIError(trips.error));
        }

        const tripPattern = mapQueryToLegacyTripPatterns(trips.value);

        return Result.ok(tripPattern);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };

  return api;
};

const toTripsQuery = (
  query: TripsQueryVariables,
  mode: StreetMode,
  numTripPatterns: number,
) => ({
  ...query,
  modes: {
    directMode: mode,
  },
  numTripPatterns,
});
