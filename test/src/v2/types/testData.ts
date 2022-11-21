export type departureFavoritesTestDataType = {
  scenarios: Array<{
    favorites: Array<{
      lineId: string;
      quayId: string;
      quayName: string;
      stopId: string;
      lineNumber: string;
      lineName: string;
      lineTransportationMode: string;
      lineTransportationSubMode: string;
      quayPublicCode?: string;
    }>;
  }>;
};

export type stopsNearestTestDataType = {
  scenarios: Array<{
    query: {
      lat: string;
      lon: string;
      distance: number;
    };
    expectedResult: {
      stopPlaces: Array<string>;
    };
  }>;
};

export type stopsDetailsTestDataType = {
  scenarios: Array<{
    query: {
      stopPlaceIds: Array<string>;
    };
    expectedResults: Array<{
      stopPlaceId: string;
      stopPlaceName: string;
      quays: Array<{
        id: string;
        name: string;
        publicCode: null | string;
        description: null | string;
      }>;
    }>;
  }>;
};

export type serviceJourneyTestDataType = {
  scenarios: Array<{
    query: {
      to: {
        name: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
        place: string;
      };
      from: {
        name: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
        place: string;
      };
      when: string;
      arriveBy: boolean;
    };
  }>;
};

export type tripsTestDataType = {
  scenarios: Array<{
    query: {
      to: {
        name: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
        place?: string;
      };
      from: {
        name: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
        place?: string;
      };
      when: string;
      arriveBy: boolean;
      cursor?: string;
    };
    expectedResult: {
      legModes: null | Array<{
        pattern: number;
        modes: Array<string>;
      }>;
      minimumTripPatterns: number;
    };
  }>;
};

export type singleTripsTestDataType = {
  query: {
    to: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
      place?: string;
    };
    from: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
      place?: string;
    };
    when: string;
    arriveBy: boolean;
    cursor?: string;
  };
  expectedResult: {
    legModes: null | Array<{
      pattern: number;
      modes: Array<string>;
    }>;
    minimumTripPatterns: number;
  };
};
