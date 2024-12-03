/*
Scenarios for v1 requests
 */

import {
  geocoderFeaturesTestData,
  geocoderReverseTestData,
} from './testData/testData';
import {geocoderFeatures, geocoderReverse} from './geocoder';

//export function geocoderScenarioV1() {
export const geocoderScenarioV1 = (): void => {
  // Requests
  geocoderFeatures(geocoderFeaturesTestData);
  geocoderReverse(geocoderReverseTestData);
};
