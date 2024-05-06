import {
  departuresScenario,
  departuresScenarioPerformance,
  serviceJourneyScenario,
  tripsScenario,
  mobilityScenario,
} from './v2/v2Scenario';
import {getDayNextWeek} from './utils/utils';
import {
  departuresScenarioV1,
  geocoderScenarioV1,
  journeyScenarioV1,
  serviceJourneyScenarioV1,
} from './v1/v1Scenario';
import {stationByIdScenario} from './v2/mobility/scenario';

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
  departuresScenarioV1(searchDate);
  geocoderScenarioV1();
  journeyScenarioV1(searchDate);
  serviceJourneyScenarioV1(searchDate);

  // V2
  departuresScenario(searchDate);
  tripsScenario(searchDate);
  serviceJourneyScenario(searchDate);
  mobilityScenario();
};

//Test
const test = (): void => {
  stationByIdScenario();
};

//Performance test
const bffPerformanceTest = (): void => {
  const searchDate = getDayNextWeek(4);
  if (__ITER === 0) {
    // Some initialization
  }
  departuresScenarioPerformance(searchDate);
};
