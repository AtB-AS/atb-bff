import {
  departuresScenario,
  departuresScenarioPerformance,
  serviceJourneyScenario,
  tripsScenario,
} from "./v2/v2Scenario";
import { getNextThursday } from "./utils/utils";
import {
  departuresScenarioV1,
  geocoderScenarioV1,
  journeyScenarioV1,
  serviceJourneyScenarioV1,
} from "./v1/v1Scenario";

//Scenarios
export const scn = (usecase: string): void => {
  switch (usecase) {
    case "test":
      return test();
    case "bff":
      return bff();
    case "bffPerformanceTest":
      return bffPerformanceTest();
  }
};

//Functional test
const bff = (): void => {
  let searchDate = getNextThursday();
  // V1
  departuresScenarioV1(searchDate);
  geocoderScenarioV1();
  journeyScenarioV1(searchDate);
  serviceJourneyScenarioV1(searchDate);

  // V2
  departuresScenario(searchDate);
  tripsScenario(searchDate);
  serviceJourneyScenario(searchDate);
};

//Test
const test = (): void => {
  let searchDate = getNextThursday();
  departuresScenario(searchDate);
  tripsScenario(searchDate);
  serviceJourneyScenario(searchDate);
};

//Performance test
const bffPerformanceTest = (): void => {
  let searchDate = getNextThursday();
  if (__ITER === 0) {
    // Some initialization
  }
  departuresScenarioPerformance(searchDate);
};
