/*
Scenarios for v1 requests
 */

import {departuresGrouped, departuresRealtime} from './departures';
import {
  departuresGroupedTestData,
  geocoderFeaturesTestData,
  geocoderReverseTestData,
  tripTestData,
} from './testData/testData';
import {serviceJourneyTestData} from '../v2/testData/testData';
import {geocoderFeatures, geocoderReverse} from './geocoder';
import {trip} from './journey';
import {
  serviceJourneyDepartures,
  serviceJourneyPolyline,
} from './servicejourney';

//Scenario with std pattern
//export function departuresScenarioV1(searchDate: string) {
export const departuresScenarioV1 = (searchDate: string): void => {
  // Requests
  departuresGrouped(departuresGroupedTestData, searchDate);
  departuresRealtime('NSR:Quay:73575', searchDate);
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
};

//export function serviceJourneyScenarioV1(searchDate) {
export const serviceJourneyScenarioV1 = (searchDate: string): void => {
  // Requests
  serviceJourneyDepartures(serviceJourneyTestData, searchDate);
  serviceJourneyPolyline(serviceJourneyTestData, searchDate);
};
