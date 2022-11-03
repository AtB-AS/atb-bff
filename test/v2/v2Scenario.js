/*
Scenarios for v2 requests
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
} from './departures/index.js';
import {
  stopsNearestTestData,
  stopsDetailsTestData,
  departureFavoritesTestData,
  tripsTestData,
  serviceJourneyTestData
} from './testData/testData.js';
import { singleTrip, trips, tripsWithCursor } from './trips/index.js';
import { polyline } from './servicejourney/index.js';

//Scenario with std pattern
export function departuresScenario(searchDate) {
  // Requests
  stopsNearest(stopsNearestTestData);
  stopsDetails(stopsDetailsTestData);
  stopDepartures('NSR:StopPlace:42912', searchDate);
  stopDeparturesPOSTandGET('NSR:StopPlace:42912', searchDate);
  quayDepartures('NSR:Quay:73576', searchDate);
  quayDeparturesPOSTandGET('NSR:Quay:73576', searchDate);
  departureFavorites(departureFavoritesTestData, searchDate);
  realtime('NSR:Quay:73576', searchDate);

  // Combinations
  quayDeparturesVsStopDepartures('NSR:StopPlace:42912', searchDate);
  realtimeForQuayDepartures('NSR:Quay:73576', searchDate);
  departureFavoritesVsQuayDepartures(departureFavoritesTestData, searchDate);
}

export function tripsScenario(searchDate) {
  // Requests
  trips(tripsTestData, searchDate, false);
  trips(tripsTestData, searchDate, true);
  tripsWithCursor(tripsTestData, searchDate, false);
  tripsWithCursor(tripsTestData, searchDate, true);
  singleTrip(tripsTestData.scenarios[1], searchDate);
}

export function serviceJourneyScenario(searchDate) {
  // Requests
  polyline(serviceJourneyTestData, searchDate);
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
