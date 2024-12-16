/*
Utility functions
 */

import {RefinedResponse, ResponseType} from 'k6/http';
import {JSONArray, JSONObject} from 'k6';

export const randomNumber = (
  max: number,
  zeroPaddings: boolean = false,
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
  noDecimals: number,
): number => {
  return Math.floor(floatValue * 10 ** noDecimals) / 10 ** noDecimals;
};

export const randomNumberInclusiveInInterval = (
  min: number,
  max: number,
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
  sorting: string = 'ASC',
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
  startTime: string,
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
  startTime: string,
): boolean => {
  for (let expTime of expEndTimes) {
    if (Date.parse(startTime) < Date.parse(expTime as string)) {
      return false;
    }
  }
  return true;
};

// List of holidays, i.e. days with either routes as a Saturday or a Sunday
const holidays = [
  '2024-12-24',
  '2024-12-25',
  '2024-12-26',
  '2024-12-27',
  '2024-12-28',
  '2024-12-29',
  '2024-12-30',
  '2024-12-31',
  '2025-01-01',
  '2025-04-16',
  '2025-04-17',
  '2025-04-18',
  '2025-04-21',
  '2025-05-01',
  '2025-05-29',
  '2025-06-09',
  '2025-12-24',
  '2025-12-25',
  '2025-12-26',
  '2025-12-27',
  '2025-12-28',
  '2025-12-29',
  '2025-12-30',
  '2025-12-31',
  '2026-01-01',
];

// Check if a given date is a holiday (format YYYY-MM-DD)
const isHoliday = (testDate: string): boolean => {
  return holidays.includes(testDate);
};

// Return a day the following week as a date - to be used in search
// E.g. weekday: 4 = Thursday
export const getDayNextWeek = (weekday: number): string => {
  const today = new Date();
  const increaseDays = weekday - today.getDay() + 7;
  today.setDate(today.getDate() + increaseDays);

  // Check if date is holiday - IF: Increase with a week to get same week day
  while (isHoliday(today.toISOString().split('T')[0])) {
    today.setDate(today.getDate() + 7);
  }
  return today.toISOString().split('T')[0];
};

// Return current time
export const getCurrentTime = (extraHours: number = 0): string => {
  const today = new Date();
  today.setHours(today.getHours() + extraHours);

  return today.toISOString();
};

// Checks if two dates are equal with an allowed margin (sec)
export const timeIsEqual = (
  time1: string,
  time2: string,
  allowedSecMargin: number = 0,
): boolean => {
  const allowedMillisMargin = allowedSecMargin * 1000;
  const time1D = new Date(time1);
  const time2D = new Date(time2);

  return !(Math.abs(time1D.getTime() - time2D.getTime()) > allowedMillisMargin);
};

// Checks if two ints are equal with an allowed margin (sec)
export const durationIsEqual = (
  time1: number,
  time2: number,
  allowedSecMargin: number = 0,
): boolean => {
  return !(Math.abs(time1 - time2) > allowedSecMargin);
};

// Utility function to get the json response with correct casting
export const jCheck = (
  response: RefinedResponse<ResponseType>,
  jsonSelector: string,
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
