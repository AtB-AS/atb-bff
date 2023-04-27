export type VehicleInfoType =
  | {
      id: string;
      lat: number;
      lon: number;
      currentFuelPercent: number;
    }
  | undefined;
