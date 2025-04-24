/*
Scenarios for v2 requests
 */

import {sleep} from 'k6';
import {randomNumberInclusiveInInterval} from '../utils/utils';
import {
  departureFavorites,
  departureFavoritesVsQuayDepartures,
  departures,
  realtimeForQuayDepartures,
  realtimeScenario,
  stopsDetails,
  stopsNearest,
} from './departures';
import {
  stopsNearestTestData,
  stopsDetailsTestData,
  departureFavoritesTestData,
  tripsTestData,
  serviceJourneyTestData,
} from './testData/testData';
import {
  filteredTripsScenario,
  singleTrip,
  trips,
  tripsWithCursor,
} from './trips';
import {
  polyline,
  serviceJourneyDepartures,
  serviceJourneyCalls,
} from './servicejourney';
import {stations, vehicles} from './mobility';
import {stationByIdScenario} from './mobility/scenario';
import {oldAppVersion} from './appVersion';

//Scenario with std pattern
export const departuresScenario = (searchDate: string): void => {
  // Requests
  stopsNearest(stopsNearestTestData);
  stopsDetails(stopsDetailsTestData);
  departureFavorites(departureFavoritesTestData, searchDate);
  realtimeScenario('NSR:Quay:71181', 'ATB:Line:2_1');
  departures(['NSR:Quay:73576'], searchDate);
  departures(['NSR:Quay:73576', 'NSR:Quay:71184'], searchDate);

  // Combinations
  realtimeForQuayDepartures('NSR:Quay:73576');
  departureFavoritesVsQuayDepartures(departureFavoritesTestData, searchDate);
};

export const tripsScenario = (searchDate: string): void => {
  // Requests
  trips(tripsTestData, searchDate, false);
  trips(tripsTestData, searchDate, true);
  tripsWithCursor(tripsTestData, searchDate, false);
  tripsWithCursor(tripsTestData, searchDate, true);
  singleTrip(tripsTestData.scenarios[1], searchDate);
  filteredTripsScenario(searchDate);
};

export const serviceJourneyScenario = (searchDate: string): void => {
  // Requests
  serviceJourneyDepartures(serviceJourneyTestData, searchDate);
  serviceJourneyCalls(serviceJourneyTestData, searchDate);
  polyline(serviceJourneyTestData, searchDate);
};

export const mobilityScenario = (): void => {
  // Requests
  vehicles(200);
  stations('BICYCLE', 250);
  stations('CAR', 500);

  // NB! DISABLED until Staging is using Staging
  //vehicleByIdScenario();
  stationByIdScenario();
};

export const appVersionScenario = (): void => {
  // Requests
  oldAppVersion('1.30');
  oldAppVersion('1.53');
};

//Performance scenario with different patterns
export const departuresScenarioPerformance = (searchDate: string): void => {
  const rand = Math.random();

  // 20 %
  if (rand < 0.2) {
    for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++) {
      polyline(serviceJourneyTestData, searchDate);
      sleep(1);
    }
  }
  // 30 %
  else if (rand >= 0.2 && rand < 0.5) {
    for (let i = 0; i < randomNumberInclusiveInInterval(1, 5); i++) {
      polyline(serviceJourneyTestData, searchDate);
      sleep(1);
    }
  }
  // 50 %
  else {
    //0. find recent tickets
    polyline(serviceJourneyTestData, searchDate);
    sleep(1);
  }
};
