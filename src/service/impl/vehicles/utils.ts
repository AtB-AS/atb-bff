import {VehicleFragment} from '../fragments/vehicles-gql/vehicle.graphql-gen';

const toTimestamp = (vehicle: VehicleFragment): number | undefined => {
  if (!vehicle.lastUpdated) return undefined;
  const timestamp = new Date(vehicle.lastUpdated).getTime();
  return Number.isNaN(timestamp) ? undefined : timestamp;
};

/**
 * Creates a stateful filter for a single vehicle update stream. Upstream
 * updates can arrive out of order, so the filter remembers the newest
 * `lastUpdated` it has seen and rejects updates that are older than it.
 *
 * Given the vehicle updates in a message, it returns the newest one, or
 * `undefined` if all of them are older than an update already accepted.
 * Updates without a valid `lastUpdated` can't be ordered, and are only
 * returned if the message has no update with a valid `lastUpdated`.
 */
export const createStaleVehicleUpdateFilter = () => {
  let newestTimestamp: number | undefined;

  return (vehicles: VehicleFragment[]): VehicleFragment | undefined => {
    let newest: VehicleFragment | undefined;
    let newestInMessage: number | undefined;
    for (const vehicle of vehicles) {
      const timestamp = toTimestamp(vehicle);
      if (timestamp === undefined) {
        newest ??= vehicle;
      } else if (newestInMessage === undefined || timestamp > newestInMessage) {
        newest = vehicle;
        newestInMessage = timestamp;
      }
    }

    if (newestInMessage === undefined) return newest;
    if (newestTimestamp !== undefined && newestInMessage < newestTimestamp) {
      return undefined;
    }
    newestTimestamp = newestInMessage;
    return newest;
  };
};
