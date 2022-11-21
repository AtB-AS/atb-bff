/*
Scenarios for v1 requests
 */

import {
  departuresGrouped,
  departuresRealtime,
  quayDepartures,
  stopDetails,
  stopQuays
} from './departures';
import {
  departuresGroupedTestData,
  stopDetailsTestData,
  geocoderFeaturesTestData,
  geocoderReverseTestData,
  tripTestData,
  serviceJourneyTestData
} from './testData/testData';
import { geocoderFeatures, geocoderReverse } from './geocoder';
import { singleTrip, trip, tripPOSTandGET } from './journey';
import {
  serviceJourneyDepartures,
  serviceJourneyPolyline
} from './servicejourney';

//Scenario with std pattern
//export function departuresScenarioV1(searchDate: string) {
export const departuresScenarioV1 = (searchDate: string): void => {
  // Requests
  departuresGrouped(departuresGroupedTestData, searchDate);
  departuresRealtime('NSR:Quay:73575', searchDate);
  quayDepartures('NSR:Quay:73576');
  stopDetails(stopDetailsTestData);
  stopQuays(stopDetailsTestData);
};

//export function geocoderScenarioV1() {
export const geocoderScenarioV1 = (): void => {
  // Requests
  geocoderFeatures(geocoderFeaturesTestData);
  geocoderReverse(geocoderReverseTestData);
};

//export function journeyScenarioV1(searchDate) {
export const journeyScenarioV1 = (searchDate: string): void => {
  // Requests
  trip(tripTestData, searchDate, false);
  trip(tripTestData, searchDate, true);
  tripPOSTandGET(tripTestData, searchDate);
  singleTrip(tripTestData, searchDate);
};

//export function serviceJourneyScenarioV1(searchDate) {
export const serviceJourneyScenarioV1 = (searchDate: string): void => {
  // Requests
  serviceJourneyDepartures(serviceJourneyTestData, searchDate);
  serviceJourneyPolyline(serviceJourneyTestData, searchDate);
};
