import {ITrips_v2} from '../../interface';

import {Result} from '@badrap/result';
import {TripsQueryWithJourneyIds} from '../../../types/trips';
import {APIError} from '../../types';
import {mapQueryToLegacyTripPatterns} from './converters';
import {getSingleTrip, getTrips} from './trips';
import {ReqRefDefaults, Request} from '@hapi/hapi';

export default (): ITrips_v2 => {
  const api: ITrips_v2 = {
    async getTrips(query, headers: Request<ReqRefDefaults>) {
      return getTrips(query, headers);
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
