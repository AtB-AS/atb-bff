import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers.js';
import {
  arrivesBeforeExpectedEndTime,
  departsAfterExpectedStartTime,
  isEqual
} from '../../utils/utils.js';

export function trip(testData, searchDate, arriveBy) {
  let searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = arriveBy
      ? `v1_trip_arriveBy_${testData.scenarios.indexOf(test)}`
      : `v1_trip_departAfter_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v1/journey/trip`;
    // Update the search time
    test.query.searchDate = searchTime;
    // Update arriveBy
    test.query.arriveBy = arriveBy;

    let res = http.post(url, JSON.stringify(test.query), {
      tags: { name: requestName },
      bffHeaders: bffHeadersPost
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    // Assert returned time against expected times
    if (test.query.arriveBy) {
      expects.push({
        check: 'should have expected end times before requested time',
        expect: arrivesBeforeExpectedEndTime(
          res.json('@this.#.expectedEndTime'),
          searchTime
        )
      });
    } else {
      expects.push({
        check: 'should have expected start times after requested time',
        expect: departsAfterExpectedStartTime(
          res.json('@this.#.expectedStartTime'),
          searchTime
        )
      });
    }

    // Assert correct start and stop
    let fromName = [];
    let toName = [];
    let expFromName = test.query.from.name;
    let expToName = test.query.to.name;

    for (let pattern of res.json('@this')) {
      let noLegs = pattern.legs.length;
      fromName.push(pattern.legs[0].fromPlace.name);
      toName.push(pattern.legs[noLegs - 1].toPlace.name);
    }
    expects.push(
      {
        check: 'should have correct from names',
        expect: fromName.filter(e => e !== expFromName).length === 0
      },
      {
        check: 'should have correct to names',
        expect: toName.filter(e => e !== expToName).length === 0
      }
    );

    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}

export function tripPOSTandGET(testData, searchDate) {
  let test = testData.scenarios[0];
  let searchTime = `${searchDate}T10:00:00.000Z`;
  const requestName = 'v1_tripPOSTandGET';
  // Update the query
  test.query.searchDate = searchTime;
  test.query.arriveBy = false;

  let urlGet = `${conf.host()}/bff/v1/journey/trip?from=${encodeURI(
    test.query.from.name
  )}&to=${encodeURI(test.query.to.name)}&when=${searchTime}`;
  let resGet = http.get(urlGet, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });
  // limit POST after the GET response
  test.query.limit = resGet.json('@this.#');
  let urlPost = `${conf.host()}/bff/v1/journey/trip`;
  let resPost = http.post(urlPost, JSON.stringify(test.query), {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  let expects = [
    { check: 'should have status 200', expect: resPost.status === 200 },
    { check: 'should have status 200', expect: resGet.status === 200 }
  ];

  // Assert the expected start times
  expects.push(
    {
      check:
        'should have expected start times after requested time for GET request',
      expect: departsAfterExpectedStartTime(
        resGet.json('@this.#.expectedStartTime'),
        searchTime
      )
    },
    {
      check:
        'should have expected start times after requested time for POST request',
      expect: departsAfterExpectedStartTime(
        resPost.json('@this.#.expectedStartTime'),
        searchTime
      )
    },
    {
      check: 'should have same expected start times in GET and POST requests',
      expect: isEqual(
        resGet.json('@this.#.expectedStartTime'),
        resPost.json('@this.#.expectedStartTime')
      )
    }
  );

  metrics.addFailureIfMultipleChecks(
    [resPost.request.url, resGet.request.url],
    resPost.timings.duration + resGet.timings.duration,
    requestName,
    expects
  );
}

export function singleTrip(testData, searchDate) {
  let test = testData.scenarios[0];
  let searchTime = `${searchDate}T10:00:00.000Z`;
  const requestName = 'v1_singleTrip';
  // Update the query
  test.query.searchDate = searchTime;
  test.query.limit = 1;
  test.query.arriveBy = false;

  let urlTrip = `${conf.host()}/bff/v1/journey/trip`;
  let resTrip = http.post(urlTrip, JSON.stringify(test.query), {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });
  let singleTripId = resTrip.json('@this.0.id');
  let urlSingleTrip = `${conf.host()}/bff/v1/journey/single-trip?id=${singleTripId}`;
  let resSingleTrip = http.get(urlSingleTrip, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });

  let expects = [
    {
      check: 'should have status 200 on /trip',
      expect: resTrip.status === 200
    },
    {
      check: 'should have status 200 on /single-trip',
      expect: resSingleTrip.status === 200
    }
  ];

  // Assert equality
  expects.push(
    {
      check: 'should have same expected start time',
      expect:
        resTrip.json('@this.0.expectedStartTime') ===
        resSingleTrip.json('expectedStartTime')
    },
    {
      check: 'should have same total distance',
      expect:
        resTrip.json('@this.0.distance') === resSingleTrip.json('distance')
    },
    {
      check: 'should have same service journey on the first leg',
      expect:
        resTrip.json('@this.0.legs.0.serviceJourney.id') ===
        resSingleTrip.json('legs.0.serviceJourney.id')
    }
  );

  metrics.addFailureIfMultipleChecks(
    [resTrip.request.url, resSingleTrip.request.url],
    resTrip.timings.duration + resSingleTrip.timings.duration,
    requestName,
    expects
  );
}
