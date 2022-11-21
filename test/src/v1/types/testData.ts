export type serviceJourneyTestDataType = {
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
      searchDate: string;
      arriveBy: boolean;
      modes: Array<string>;
      limit: number;
    };
  }>;
};

export type tripTestDataType = {
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
      searchDate: string;
      arriveBy: boolean;
      limit: number;
      modes?: Array<string>;
    };
  }>;
};

export type geocoderTestDataType = {
  scenarios: Array<{
    query: {
      latitude: number;
      longitude: number;
      searchString?: string;
    };
    expectedResults: Array<{
      id: string;
      name: string;
      category: string;
    }>;
    moreResults: boolean;
  }>;
};

export type departuresGroupedTestDataType = {
  scenarios: Array<{
    query: {
      location: {
        layer: 'venue' | 'address';
        id?: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
      };
    };
    expectedResults: Array<{
      stopPlace: string;
      quays: Array<string>;
      shouldHaveDepartures: boolean;
    }>;
  }>;
};

export type stopDetailsTestDataType = {
  scenarios: Array<{
    query: {
      stopPlace: string;
    };
    expectedResult: {
      stopPlace: string;
      name: string;
      quays: Array<string>;
    };
  }>;
};
