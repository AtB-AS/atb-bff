import { sleep } from 'k6';
import {
  departuresScenario,
  departuresScenarioPerformance,
  serviceJourneyScenario,
  tripsScenario
} from './v2/v2Scenario.js';
import { getNextThursday } from './utils/utils.js';
import {
  departuresScenarioV1,
  geocoderScenarioV1,
  journeyScenarioV1,
  serviceJourneyScenarioV1
} from './v1/v1Scenario.js';

//Scenarios
export const scn = {
  test: () => test(),
  bff: () => bff(),
  bffPerformanceTest: () => bffPerformanceTest()
};

//Functional test
function bff() {
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
}

//Test
function test() {
  let searchDate = getNextThursday();
  serviceJourneyScenarioV1(searchDate);
}

//Performance test
function bffPerformanceTest() {
  if (__ITER === 0) {
    // Some initialization
  }

  departuresScenarioPerformance();
}
