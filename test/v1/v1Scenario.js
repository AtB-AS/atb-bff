/*
Scenarios for v1 requests
 */

import {
  departuresGrouped,
  departuresRealtime,
  quayDepartures,
  stopDetails,
  stopQuays
} from './departures/index.js';
import {
  departuresGroupedTestData,
  stopDetailsTestData,
  geocoderFeaturesTestData,
  geocoderReverseTestData,
  tripTestData,
  serviceJourneyTestData
} from './testData/testData.js';
import { geocoderFeatures, geocoderReverse } from './geocoder/index.js';
import { singleTrip, trip, tripPOSTandGET } from './journey/index.js';
import {
  serviceJourneyDepartures,
  serviceJourneyPolyline
} from './servicejourney/index.js';

//Scenario with std pattern
export function departuresScenarioV1(searchDate) {
  // Requests
  departuresGrouped(departuresGroupedTestData, searchDate);
  departuresRealtime('NSR:Quay:73575', searchDate);
  quayDepartures('NSR:Quay:73576', searchDate);
  stopDetails(stopDetailsTestData);
  stopQuays(stopDetailsTestData);
}

export function geocoderScenarioV1() {
  // Requests
  geocoderFeatures(geocoderFeaturesTestData);
  geocoderReverse(geocoderReverseTestData);
}

export function journeyScenarioV1(searchDate) {
  // Requests
  trip(tripTestData, searchDate, false);
  trip(tripTestData, searchDate, true);
  tripPOSTandGET(tripTestData, searchDate);
  singleTrip(tripTestData, searchDate);
}

export function serviceJourneyScenarioV1(searchDate) {
  // Requests
  serviceJourneyDepartures(serviceJourneyTestData, searchDate);
  serviceJourneyPolyline(serviceJourneyTestData, searchDate);
}
