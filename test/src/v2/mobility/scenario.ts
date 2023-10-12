import {vehicle, vehicles} from './vehicles';
import {StationInfoType, VehicleInfoType} from '../types/mobility';
import {station, stations} from './stations';

// Get vehicles and ask for a specific vehicle
export function vehicleByIdScenario(): void {
  let vehicleInfo: VehicleInfoType = vehicles(200);
  if (vehicleInfo !== undefined) {
    vehicle(vehicleInfo);
  }

  vehicleInfo = vehicles(300);
  if (vehicleInfo !== undefined) {
    vehicle(vehicleInfo);
  }
}

// Get vehicles and ask for a specific vehicle
export function stationByIdScenario(): void {
  let stationInfo: StationInfoType = stations('BICYCLE', 250);
  if (stationInfo !== undefined) {
    station(stationInfo);
  }

  stationInfo = stations('BICYCLE', 400);
  if (stationInfo !== undefined) {
    station(stationInfo);
  }

  stationInfo = stations('CAR', 500);
  if (stationInfo !== undefined) {
    station(stationInfo);
  }
}
