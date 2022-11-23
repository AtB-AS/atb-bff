export type TripsSingleSimplifiedResponseType = {
  expectedStartTime: string;
  expectedEndTime: string;
  distance: number;
  legs: Array<{
    fromPlace: {
      name: string;
    };
    toPlace: {
      name: string;
    };
    serviceJourney: {
      id: string;
    };
  }>;
};

export type TripsSimplifiedResponseType = TripsSingleSimplifiedResponseType[];
