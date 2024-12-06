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
