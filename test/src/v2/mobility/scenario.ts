import { vehicle, vehicles } from './vehicles';
import { VehicleInfoType } from '../types/mobility';

// Get vehicles and ask for a specific vehicle
export function vehicleByIdScenario(): void {
  let vehicleInfo: VehicleInfoType = vehicles(200);
  if (vehicleInfo !== undefined) {
    vehicle(vehicleInfo, 100);
  }

  vehicleInfo = vehicles(300);
  if (vehicleInfo !== undefined) {
    vehicle(vehicleInfo, 100);
  }
}
