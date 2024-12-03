import {
  departuresScenario,
  departuresScenarioPerformance,
  serviceJourneyScenario,
  tripsScenario,
  mobilityScenario,
  appVersionScenario,
} from './v2/v2Scenario';
import {getDayNextWeek} from './utils/utils';
import {geocoderScenarioV1} from './v1/v1Scenario';

//Scenarios
export const scn = (usecase: string): void => {
  switch (usecase) {
    case 'test':
      return test();
    case 'bff':
      return bff();
    case 'bffPerformanceTest':
      return bffPerformanceTest();
  }
};

//Functional test
const bff = (): void => {
  const searchDate = getDayNextWeek(4);
  // V1
  geocoderScenarioV1();

  // V2
  departuresScenario(searchDate);
  tripsScenario(searchDate);
  serviceJourneyScenario(searchDate);
  mobilityScenario();
  appVersionScenario();
};

//Test
const test = (): void => {
  appVersionScenario();
};

//Performance test
const bffPerformanceTest = (): void => {
  const searchDate = getDayNextWeek(4);
  if (__ITER === 0) {
    // Some initialization
  }
  departuresScenarioPerformance(searchDate);
};
