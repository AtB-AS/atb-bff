type DistancesVersion = {
  distance: number;
  isPricingPath: boolean;
  validityPeriod: {
    from: Date;
    to: Date;
  };
};

export type DistancesResult = {
  id: string;
  fromStopPlaceId: string;
  toStopPlaceId: string;
  organisationId: number;
  versions: DistancesVersion[];
};
