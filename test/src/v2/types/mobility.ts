export type VehicleInfoType =
  | {
      id: string;
      lat: number;
      lon: number;
      currentFuelPercent: number;
    }
  | undefined;

export type StationInfoType =
  | {
      id: string;
      count: number;
      formFactor: string;
    }
  | undefined;
