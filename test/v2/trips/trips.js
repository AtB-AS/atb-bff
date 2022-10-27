import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersPost } from '../../utils/headers.js';
import {
  arrivesBeforeExpectedEndTime,
  departsAfterExpectedStartTime,
  isEqual,
  timeArrayIsSorted
} from '../../utils/utils.js';

// Travel search request
export function trips(testData, searchDate, arriveBy = false) {
  let searchTime = `${searchDate}T08:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = arriveBy
      ? `trips_arriveBy_${testData.scenarios.indexOf(test)}`
      : `trips_departAfter_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v2/trips`;
    // Update the search time
    test.query.when = searchTime;
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
          res.json('trip.tripPatterns.#.expectedEndTime'),
          searchTime
        )
      });
    } else {
      expects.push({
        check: 'should have expected start times after requested time',
        expect: departsAfterExpectedStartTime(
          res.json('trip.tripPatterns.#.expectedStartTime'),
          searchTime
        )
      });
    }

    // Assert correct start and stop
    // Assert legs are connected
    // Assert aggregated walk distance is correct on each trip pattern
    let fromPlaces = [];
    let toPlaces = [];
    let expFromPlace = test.query.from.hasOwnProperty('place')
      ? test.query.from.place
      : test.query.from.name;
    let expToPlace = test.query.to.hasOwnProperty('place')
      ? test.query.to.place
      : test.query.to.name;

    let legsAreConnected = true;
    let walkDistanceIsCorrect = true;
    for (let pattern of res.json('trip.tripPatterns')) {
      let noLegs = pattern.legs.length;
      // For trip start and stop
      test.query.from.hasOwnProperty('place')
        ? fromPlaces.push(pattern.legs[0].fromPlace.quay.stopPlace.id)
        : fromPlaces.push(pattern.legs[0].fromPlace.name);
      test.query.to.hasOwnProperty('place')
        ? toPlaces.push(pattern.legs[noLegs - 1].toPlace.quay.stopPlace.id)
        : toPlaces.push(pattern.legs[noLegs - 1].toPlace.name);
      // For connectivity on each trip (disregarding quay or not)
      let lastFrom,
        lastTo = '';
      let walkDistance = 0.0;
      pattern.legs.forEach((leg, index) => {
        leg.mode === 'foot'
          ? (walkDistance += leg.distance)
          : (walkDistance += 0.0);
        if (index === 0) {
          lastFrom = leg.fromPlace.name;
          lastTo = leg.toPlace.name;
        } else {
          if (leg.fromPlace.name !== lastTo) {
            legsAreConnected = false;
          }
          lastFrom = leg.fromPlace.name;
          lastTo = leg.toPlace.name;
        }
      });
      // For walk distance check
      if (Math.floor(pattern.walkDistance) !== Math.floor(walkDistance)) {
        walkDistanceIsCorrect = false;
      }
    }
    expects.push(
      {
        check: 'should have correct from place',
        expect: fromPlaces.filter(e => e !== expFromPlace).length === 0
      },
      {
        check: 'should have correct to place',
        expect: toPlaces.filter(e => e !== expToPlace).length === 0
      },
      { check: 'should have connected legs', expect: legsAreConnected },
      {
        check: 'should have correct aggregated walk distance on legs',
        expect: walkDistanceIsCorrect
      }
    );

    // Assert correct leg modes (for any given)
    if (test.expectedResult.legModes) {
      for (let trip of test.expectedResult.legModes) {
        let responseLegModes = res.json(
          `trip.tripPatterns.${trip.pattern}.legs.#.mode`
        );
        expects.push({
          check: `should have correct leg modes for trip pattern ${trip.pattern}`,
          expect: isEqual(responseLegModes, trip.modes)
        });
      }
    }

    // Assert number of trip patterns
    expects.push({
      check: `should have minimum number of trip patterns ${test.expectedResult.minimumTripPatterns}`,
      expect:
        res.json('trip.tripPatterns.#') >=
        test.expectedResult.minimumTripPatterns
    });

    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}

// Travel search request with next cursor (i.e. paging)
export function tripsWithCursor(testData, searchDate, arriveBy = false) {
  let test = testData.scenarios[0];
  let searchTime = `${searchDate}T08:00:00.000Z`;
  let requestName = arriveBy
    ? `tripsWithCursor_arriveBy`
    : `tripsWithCursor_departAfter`;
  let url = `${conf.host()}/bff/v2/trips`;
  // Update the search time
  test.query.when = searchTime;
  // Update arriveBy
  test.query.arriveBy = arriveBy;

  let res = http.post(url, JSON.stringify(test.query), {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  // Update next request with cursor
  test.query.cursor = arriveBy
    ? res.json('trip.previousPageCursor')
    : res.json('trip.nextPageCursor');
  let resNext = http.post(url, JSON.stringify(test.query), {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });
  // Remove cursor on object
  delete test.query.cursor;

  let expects = [
    { check: 'should have status 200', expect: res.status === 200 },
    {
      check: 'should have status 200 on next cursor',
      expect: resNext.status === 200
    }
  ];

  // Assert returned time against expected times
  if (test.query.arriveBy) {
    expects.push(
      {
        check:
          'should have expected end times before requested time on initial request',
        expect: arrivesBeforeExpectedEndTime(
          res.json('trip.tripPatterns.#.expectedEndTime'),
          searchTime
        )
      },
      {
        check:
          'should have expected end times before requested time on next request',
        expect: arrivesBeforeExpectedEndTime(
          resNext.json('trip.tripPatterns.#.expectedEndTime'),
          searchTime
        )
      }
    );
  } else {
    expects.push(
      {
        check:
          'should have expected start times after requested time on initial request',
        expect: departsAfterExpectedStartTime(
          res.json('trip.tripPatterns.#.expectedStartTime'),
          searchTime
        )
      },
      {
        check:
          'should have expected start times after requested time on next request',
        expect: departsAfterExpectedStartTime(
          resNext.json('trip.tripPatterns.#.expectedStartTime'),
          searchTime
        )
      }
    );
  }

  // Assert sorted returned times on initial and next request
  if (test.query.arriveBy) {
    let expectedEndTimes = res
      .json('trip.tripPatterns.#.expectedEndTime')
      .concat(resNext.json('trip.tripPatterns.#.expectedEndTime'));
    expects.push({
      check: 'should have sorted expected end times in DESC order',
      expect: timeArrayIsSorted(expectedEndTimes, 'DESC')
    });
  } else {
    let expectedStartTimes = res
      .json('trip.tripPatterns.#.expectedStartTime')
      .concat(resNext.json('trip.tripPatterns.#.expectedStartTime'));
    expects.push({
      check: 'should have sorted expected start times in ASC order',
      expect: timeArrayIsSorted(expectedStartTimes, 'ASC')
    });
  }

  // Assert correct start and stop on next request
  let fromPlaces = [];
  let toPlaces = [];
  let expFromPlace = test.query.from.hasOwnProperty('place')
    ? test.query.from.place
    : test.query.from.name;
  let expToPlace = test.query.to.hasOwnProperty('place')
    ? test.query.to.place
    : test.query.to.name;

  for (let pattern of resNext.json('trip.tripPatterns')) {
    let noLegs = pattern.legs.length;
    // For trip start and stop
    test.query.from.hasOwnProperty('place')
      ? fromPlaces.push(pattern.legs[0].fromPlace.quay.stopPlace.id)
      : fromPlaces.push(pattern.legs[0].fromPlace.name);
    test.query.to.hasOwnProperty('place')
      ? toPlaces.push(pattern.legs[noLegs - 1].toPlace.quay.stopPlace.id)
      : toPlaces.push(pattern.legs[noLegs - 1].toPlace.name);
  }
  expects.push(
    {
      check: 'should have correct from place',
      expect: fromPlaces.filter(e => e !== expFromPlace).length === 0
    },
    {
      check: 'should have correct to place',
      expect: toPlaces.filter(e => e !== expToPlace).length === 0
    }
  );

  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration + resNext.timings.duration,
    requestName,
    expects
  );
}

// Single trip request
export function singleTrip(testData, searchDate, arriveBy = false) {
  let requestName = 'singleTrip';
  let searchTime = `${searchDate}T08:00:00.000Z`;
  let noSingleTripsToTest = 2;
  let urlTrips = `${conf.host()}/bff/v2/trips`;
  let urlSingleTrip = `${conf.host()}/bff/v2/singleTrip`;
  // Update the search time
  testData.query.when = searchTime;
  // Update arriveBy
  testData.query.arriveBy = arriveBy;

  let resTrips = http.post(urlTrips, JSON.stringify(testData.query), {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  let expects = [
    {
      check: 'should have status 200 on /trips',
      expect: resTrips.status === 200
    }
  ];

  let noSingleTripsTested = 0;
  let singleTripDuration = 0.0;
  let urlSingleTripFull = '';
  let counter = 0;
  while (noSingleTripsTested < noSingleTripsToTest) {
    // Note: Only foot pattern reduces start time with 1 minute, and compressed query from singleTrip reduces with even 1 minute more.
    let noLegs = resTrips.json(`trip.tripPatterns.${counter}.legs.#`);
    let firstLegMode = resTrips.json(
      `trip.tripPatterns.${counter}.legs.0.mode`
    );
    if (!(noLegs === 1 && firstLegMode === 'foot')) {
      let comprQuery = resTrips.json(
        `trip.tripPatterns.${counter}.compressedQuery`
      );
      let bodySingle = { compressedQuery: comprQuery };

      let resSingle = http.post(urlSingleTrip, JSON.stringify(bodySingle), {
        tags: { name: requestName },
        bffHeaders: bffHeadersPost
      });

      // Note: The JSON-response is "randomly" ordered for each request. Pick out some test parameters.
      let tripsTest = [
        resTrips.json(`trip.tripPatterns.${counter}.expectedStartTime`),
        resTrips.json(`trip.tripPatterns.${counter}.duration`),
        resTrips.json(`trip.tripPatterns.${counter}.walkDistance`),
        resTrips.json(`trip.tripPatterns.${counter}.legs.#`),
        resTrips.json(`trip.tripPatterns.${counter}.compressedQuery`)
      ];
      let singleTest = [
        resSingle.json(`expectedStartTime`),
        resSingle.json(`duration`),
        resSingle.json(`walkDistance`),
        resSingle.json(`legs.#`),
        resSingle.json(`compressedQuery`)
      ];

      expects.push(
        {
          check: `should have status 200 on /singleTrip #${counter}`,
          expect: resSingle.status === 200
        },
        {
          check: `single trip details should be equal to trips results details #${counter}`,
          expect: tripsTest.toString() === singleTest.toString()
        }
      );
      noSingleTripsTested += 1;
    }
    counter += 1;
  }

  metrics.addFailureIfMultipleChecks(
    [urlSingleTripFull],
    resTrips.timings.duration + singleTripDuration,
    requestName,
    expects
  );
}
