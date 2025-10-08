type DistancesVersion = {
  distance: number;
  isPricingPath: boolean;
  validityPeriod: {
    from: Date;
    to: Date;
  };
};

export type DistancesResult = Record<string, number>;
