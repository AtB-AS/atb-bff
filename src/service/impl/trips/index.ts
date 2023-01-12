import { ITrips_v2 } from '../../interface';

import { Result } from '@badrap/result';
import { TripsQueryWithJourneyIds } from '../../../types/trips';
import { APIError } from '../../types';
import { mapQueryToLegacyTripPatterns } from './converters';
import { getSingleTrip, getTrips } from './trips';

export default (): ITrips_v2 => {
  const api: ITrips_v2 = {
    async getTrips(query) {
      return getTrips(query);
    },

    async getSingleTrip(queryWithIds: TripsQueryWithJourneyIds) {
      return getSingleTrip(queryWithIds);
    },
    async getTripPatterns(query) {
      try {
        const trips = await getTrips({
          from: query.from,
          to: query.to,
          arriveBy: query.arriveBy,
          when: query.searchDate
        });

        if (trips.isErr) {
          return Result.err(new APIError(trips.error));
        }

        const tripPattern = mapQueryToLegacyTripPatterns(trips.value);

        return Result.ok(tripPattern);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };

  return api;
};
