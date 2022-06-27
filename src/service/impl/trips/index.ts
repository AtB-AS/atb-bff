import { ITrips_v2 } from '../../interface';

import { getSingleTrip, getTrips } from './trips';
import { TripsQueryWithJourneyIds } from '../../../types/trips';

export default (): ITrips_v2 => {
  const api: ITrips_v2 = {
    async getTrips(query) {
      return getTrips(query);
    },

    async getSingleTrip(queryWithIds: TripsQueryWithJourneyIds) {
      return getSingleTrip(queryWithIds);
    }
  };

  return api;
};
