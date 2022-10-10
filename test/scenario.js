import { sleep } from 'k6';
import {
  departuresScenario,
  departuresScenarioPerformance
} from './v2/v2Scenario.js';
import { realtime } from './v2/departures/departures.js';

//Scenarios
export const scn = {
  test: () => test(),
  bff: () => bff(),
  bffPerformanceTest: () => bffPerformanceTest()
};

//Functional test
function bff() {
  departuresScenario();
}

//Test
function test() {
  realtime('NSR:Quay:73576', '2022-09-27T11:33:32.003Z');
}

//Performance test
function bffPerformanceTest() {
  if (__ITER === 0) {
    // Some initialization
  }

  departuresScenarioPerformance();
}
