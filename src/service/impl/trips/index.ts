import {ITrips_v2} from '../../interface';

import {Result} from '@badrap/result';
import {TripsQueryWithJourneyIds} from '../../../types/trips';
import {APIError} from '../../../utils/api-error';
import {mapQueryToLegacyTripPatterns} from './converters';
import {getSingleTrip, getTrips, getTripsNonTransit} from './trips';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {TripsNonTransitQueryVariables} from './journey-gql/trip.graphql-gen';
import {StreetMode} from '../../../graphql/journey/journeyplanner-types_v3';

export default (): ITrips_v2 => {
  const api: ITrips_v2 = {
    async getTrips(query, headers: Request<ReqRefDefaults>) {
      return getTrips(query, headers);
    },

    async getNonTransitTrips(query, headers) {
      const gqlQueryVariables: TripsNonTransitQueryVariables = {
        ...query,
        includeFoot: query.directModes.includes(StreetMode.Foot),
        includeBicycle: query.directModes.includes(StreetMode.Bicycle),
      };
      return getTripsNonTransit(gqlQueryVariables, headers);
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
