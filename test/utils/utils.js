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

export const randomNumberInclusiveInInterval = (min, max) => {
  let rand = Math.floor(Math.random() * (max - min));
  rand = rand + min;
  return rand;
};

// Check if an array with times are sorted ASC
export const timeArrayIsSorted = timeArray => {
  let currDate = '1900-01-01T00:00:00+02:00';
  for (let elem of timeArray) {
    if (Date.parse(elem) < Date.parse(currDate)) {
      return false;
    }
    currDate = elem;
  }
  return true;
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
