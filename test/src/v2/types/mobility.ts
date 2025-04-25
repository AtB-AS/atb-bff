import {
  Station,
  Vehicle,
} from '../../../../src/graphql/mobility/mobility-types_v2';

export type Vehicles = {
  scooters: Vehicle[];
};

export type VehicleInfoType =
  | {
      id: string;
      lat: number;
      lon: number;
      currentFuelPercent: number;
    }
  | undefined;

export type Stations = {
  bicycles?: Station[];
  cars?: Station[];
};

export type StationInfoType =
  | {
      id: string;
      capacity: number;
      formFactor: string;
    }
  | undefined;
