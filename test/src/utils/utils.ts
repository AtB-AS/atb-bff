/*
Utility functions
 */

import { RefinedResponse, ResponseType } from 'k6/http';
import { JSONArray, JSONObject } from 'k6';

export const randomNumber = (
  max: number,
  zeroPaddings: boolean = false
): string => {
  let rand = Math.floor(Math.random() * max);
  if (rand === max) {
    rand = max - 1;
  }
  let randS = rand.toString();

  // Add zeros if rand.length < 3
  if (zeroPaddings) {
    if (rand < 10) {
      randS = `00${randS}`;
    } else if (rand < 100) {
      randS = `0${randS}`;
    }
  }

  return randS;
};

export const useNoDecimals = (
  floatValue: number,
  noDecimals: number
): number => {
  return Math.floor(floatValue * 10 ** noDecimals) / 10 ** noDecimals;
};

export const randomNumberInclusiveInInterval = (
  min: number,
  max: number
): number => {
  let rand = Math.floor(Math.random() * (max - min));
  rand = rand + min;
  return rand;
};

// Checks two arrays for equality
export const isEqual = (array1: any[], array2: any[]): boolean => {
  return array1.toString() === array2.toString();
};

// Check if an array with times are sorted ASC
export const timeArrayIsSorted = (
  timeArray: string[],
  sorting: string = 'ASC'
): boolean => {
  let currDate = '1900-01-01T00:00:00+02:00';
  switch (sorting) {
    case 'ASC':
      for (let elem of timeArray) {
        if (Date.parse(elem) < Date.parse(currDate)) {
          return false;
        }
        currDate = elem;
      }
      break;
    case 'DESC':
      currDate = '2200-01-01T00:00:00+02:00';
      for (let elem of timeArray) {
        if (Date.parse(elem) > Date.parse(currDate)) {
          return false;
        }
        currDate = elem;
      }
      break;
    default:
      return false;
  }
  return true;
};

// Check that alle dates are after/equal to given time
export const departsAfterExpectedStartTime = (
  expStartTimes: string[],
  startTime: string
): boolean => {
  for (let expTime of expStartTimes) {
    if (Date.parse(startTime) > Date.parse(expTime as string)) {
      return false;
    }
  }
  return true;
};

// Check that alle dates are after/equal to given time
export const arrivesBeforeExpectedEndTime = (
  expEndTimes: string[],
  startTime: string
): boolean => {
  for (let expTime of expEndTimes) {
    if (Date.parse(startTime) < Date.parse(expTime as string)) {
      return false;
    }
  }
  return true;
};

// Return next Thursday as a date - to be used in search
export const getNextThursday = (): string => {
  const today = new Date();
  const increaseDays = 4 - today.getDay() + 7; // Thursday = 4
  today.setDate(today.getDate() + increaseDays);

  return today.toISOString().split('T')[0];
};

// Utility function to get the json response with correct casting
export const jCheck = (
  response: RefinedResponse<ResponseType>,
  jsonSelector: string
): null | boolean | number | string | JSONArray | JSONObject => {
  const jsonResult = response.json(jsonSelector);
  const jsonResultType = typeof jsonResult;
  return response ? <typeof jsonResultType>jsonResult : typeof undefined;
};

//** List headers
/*
for (let p in res.request.headers) {
        if (res.request.headers.hasOwnProperty(p)) {
            console.log(p + ' : ' + res.request.headers[p]);
        }
    }
 */

//** Print request / response
/*
console.log("** /searchForZones **")
console.log("REQUEST: " + res.request.body)
console.log("RESPONSE: " + res.status_text)
console.log("RESPONSE: " + res.body)
 */
