/*
Scenario that distributes requests according to usage pattern
 */

import { sleep } from 'k6';
import { randomNumberInclusiveInInterval } from '../utils/utils.js';
import {
  departureFavorites,
  departureFavoritesVsQuayDepartures,
  quayDepartures,
  quayDeparturesPOSTandGET,
  quayDeparturesVsStopDepartures,
  realtime,
  realtimeForQuayDepartures,
  stopDepartures,
  stopDeparturesPOSTandGET,
  stopsDetails,
  stopsNearest
} from './departures/departures.js';
import {
  stopsNearestTestData,
  stopsDetailsTestData,
  departureFavoritesTestData
} from './departures/testData.js';

//Scenario with std pattern
export function departuresScenario() {
  // Requests
  stopsNearest(stopsNearestTestData);
  stopsDetails(stopsDetailsTestData);
  stopDepartures('NSR:StopPlace:42912', '2022-09-27');
  stopDeparturesPOSTandGET('NSR:StopPlace:42912', '2022-09-27');
  quayDepartures('NSR:Quay:73576', '2022-09-27');
  quayDeparturesPOSTandGET('NSR:Quay:73576', '2022-09-27');
  departureFavorites(departureFavoritesTestData, '2022-10-10');
  realtime('NSR:Quay:73576', '2022-09-27T11:33:32.003Z');

  // Combinations
  quayDeparturesVsStopDepartures('NSR:StopPlace:42912', '2022-09-27');
  realtimeForQuayDepartures('NSR:Quay:73576', '2022-09-27');
  departureFavoritesVsQuayDepartures(departureFavoritesTestData, '2022-10-10');
}

//Performance scenario with different patterns
export function departuresScenarioPerformance() {
  let rand = Math.random();

  // 20 %
  if (rand < 0.2) {
    for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++) {
      realtime();
      sleep(1);
    }
  }
  // 30 %
  else if (rand >= 0.2 && rand < 0.5) {
    for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++) {
      realtime();
      sleep(1);
    }
  }
  // 50 %
  else {
    //0. find recent tickets
    realtime();
    sleep(1);
  }
}
