/*
Utility functions
 */

export const randomNumber = max => {
  let rand = Math.floor(Math.random() * max);
  if (rand === max) {
    rand = max - 1;
  }
  return rand;
};

export const useNoDecimals = (floatValue, noDecimals) => {
  return Math.floor(floatValue * 10 ** noDecimals) / 10 ** noDecimals;
};

export const randomNumberInclusiveInInterval = (min, max) => {
  let rand = Math.floor(Math.random() * (max - min));
  rand = rand + min;
  return rand;
};

// Checks two arrays for equality
export const isEqual = (array1, array2) => {
  return array1.toString() === array2.toString();
};

// Check if an array with times are sorted ASC
export const timeArrayIsSorted = (timeArray, sorting = 'ASC') => {
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
export const departsAfterExpectedStartTime = (expStartTimes, startTime) => {
  for (let expTime of expStartTimes) {
    if (Date.parse(startTime) > Date.parse(expTime)) {
      return false;
    }
  }
  return true;
};

// Check that alle dates are after/equal to given time
export const arrivesBeforeExpectedEndTime = (expEndTimes, startTime) => {
  for (let expTime of expEndTimes) {
    if (Date.parse(startTime) < Date.parse(expTime)) {
      return false;
    }
  }
  return true;
};

// Return next Thursday as a date - to be used in search
export const getNextThursday = () => {
  let today = new Date();
  let increaseDays = 4 - today.getDay() + 7; // Thursday = 4
  today.setDate(today.getDate() + increaseDays);

  return today.toISOString().split('T')[0];
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
