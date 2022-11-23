/*
Scenarios for v2 requests
 */

import { sleep } from 'k6';
import { randomNumberInclusiveInInterval } from '../utils/utils';
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
} from './departures';
import {
  stopsNearestTestData,
  stopsDetailsTestData,
  departureFavoritesTestData,
  tripsTestData,
  serviceJourneyTestData
} from './testData/testData';
import { singleTrip, trips, tripsWithCursor } from './trips';
import { polyline, serviceJourneyDepartures } from './servicejourney';

//Scenario with std pattern
export const departuresScenario = (searchDate: string): void => {
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
};

export const tripsScenario = (searchDate: string): void => {
  // Requests
  trips(tripsTestData, searchDate, false);
  trips(tripsTestData, searchDate, true);
  tripsWithCursor(tripsTestData, searchDate, false);
  tripsWithCursor(tripsTestData, searchDate, true);
  singleTrip(tripsTestData.scenarios[1], searchDate);
};

export const serviceJourneyScenario = (searchDate: string): void => {
  // Requests
  serviceJourneyDepartures(serviceJourneyTestData, searchDate);
  polyline(serviceJourneyTestData, searchDate);
};

//Performance scenario with different patterns
export const departuresScenarioPerformance = (searchDate: string): void => {
  const rand = Math.random();

  // 20 %
  if (rand < 0.2) {
    for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++) {
      realtime('NSR:Quay:73576', searchDate);
      sleep(1);
    }
  }
  // 30 %
  else if (rand >= 0.2 && rand < 0.5) {
    for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++) {
      realtime('NSR:Quay:73576', searchDate);
      sleep(1);
    }
  }
  // 50 %
  else {
    //0. find recent tickets
    realtime('NSR:Quay:73576', searchDate);
    sleep(1);
  }
};
