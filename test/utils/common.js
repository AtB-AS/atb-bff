/*
Common functions
 */

export function randomNumber(max){
    let rand = Math.floor(Math.random() * max);
    if (rand === max){
        rand = max - 1;
    }
    return rand;
}

export function randomNumberInclusiveInInterval(min, max){
    let rand = Math.floor(Math.random() * (max - min));
    rand = rand + min;
    return rand;
}

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