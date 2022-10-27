import { sleep } from 'k6';
import {
  departuresScenario,
  departuresScenarioPerformance, serviceJourneyScenario, tripsScenario
} from './v2/v2Scenario.js';
import {getNextThursday} from "./utils/utils.js";
import {trips, tripsWithCursor} from "./v2/trips/trips.js";
import {tripsTestData} from "./v2/trips/testData.js";

//Scenarios
export const scn = {
  test: () => test(),
  bff: () => bff(),
  bffPerformanceTest: () => bffPerformanceTest()
};

//Functional test
function bff() {
  let searchDate = getNextThursday()

  departuresScenario(searchDate);
  tripsScenario(searchDate);
  serviceJourneyScenario(searchDate)
}

//Test
function test() {
  let searchDate = getNextThursday()

  trips(tripsTestData, searchDate, true)
  tripsWithCursor(tripsTestData, searchDate, true)
}

//Performance test
function bffPerformanceTest() {
  if (__ITER === 0) {
    // Some initialization
  }

  departuresScenarioPerformance();
}
