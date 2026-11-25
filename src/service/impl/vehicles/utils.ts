import {VehicleFragment} from '../fragments/vehicles-gql/vehicle.graphql-gen';

/**
 * Returns `lastUpdated` as epoch milliseconds. A missing or invalid
 * `lastUpdated` gives 0, so that it counts as older than any real time.
 */
const getLastUpdatedTime = (vehicle: VehicleFragment): number => {
  const time = new Date(vehicle.lastUpdated).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const findNewest = (
  vehicles: VehicleFragment[],
): VehicleFragment | undefined => {
  if (vehicles.length === 0) return undefined;

  let newest = vehicles[0];
  for (const vehicle of vehicles) {
    if (getLastUpdatedTime(vehicle) > getLastUpdatedTime(newest)) {
      newest = vehicle;
    }
  }
  return newest;
};

/**
 * Upstream vehicle updates can arrive out of order. The returned function
 * takes the vehicle updates of one message and returns the newest of them,
 * or `undefined` if it is older than an update returned earlier.
 */
export const createStaleVehicleUpdateFilter = () => {
  let newestTimeSeen = 0;

  return (vehicles: VehicleFragment[]): VehicleFragment | undefined => {
    const newest = findNewest(vehicles);
    if (!newest) return undefined;

    const time = getLastUpdatedTime(newest);
    if (time < newestTimeSeen) return undefined;

    newestTimeSeen = time;
    return newest;
  };
};
