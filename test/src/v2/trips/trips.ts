import http from 'k6/http';
import {conf, ExpectsType, metrics} from '../../config/configuration';
import {bffHeadersPost} from '../../utils/headers';
import {
  arrivesBeforeExpectedEndTime,
  departsAfterExpectedStartTime,
  durationIsEqual,
  isEqual,
  timeArrayIsSorted,
  timeIsEqual,
} from '../../utils/utils';
import {
  singleTripsTestDataType,
  TripPatternWithCompressedQuery,
  tripsTestDataType,
} from '../types';
import {TripsQuery} from '../../../../src/service/impl/trips/journey-gql/trip.graphql-gen';
import {transportModesType} from '../types/trips';
import {filteredTripsTestDataType} from '../types/testData';
import {filteredTripsTestData} from '../testData/testData';

// Travel search request
export function trips(
  testData: tripsTestDataType,
  searchDate: string,
  arriveBy: boolean = false,
): void {
  const searchTime = `${searchDate}T07:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = arriveBy
      ? `v2_trips_arriveBy_${testData.scenarios.indexOf(test)}`
      : `v2_trips_departAfter_${testData.scenarios.indexOf(test)}`;
    const url = `${conf.host()}/bff/v2/trips`;
    // Update the search time
    test.query.when = searchTime;
    // Update arriveBy
    test.query.arriveBy = arriveBy;

    const res = http.post(url, JSON.stringify(test.query), {
      tags: {name: requestName},
      headers: bffHeadersPost(),
    });

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];

    try {
      const json: TripsQuery = res.json() as TripsQuery;

      // Assert returned time against expected times
      if (test.query.arriveBy) {
        expects.push({
          check: 'should have expected end times before requested time',
          expect: arrivesBeforeExpectedEndTime(
            json.trip.tripPatterns.map((pattern) => pattern.expectedEndTime),
            searchTime,
          ),
        });
      } else {
        expects.push({
          check: 'should have expected start times after requested time',
          expect: departsAfterExpectedStartTime(
            json.trip.tripPatterns.map((pattern) => pattern.expectedStartTime),
            searchTime,
          ),
        });
      }

      // Assert correct start and stop
      // Assert legs are connected
      // Assert aggregated walk distance is correct on each trip pattern
      const fromPlaces: string[] = [];
      const toPlaces: string[] = [];
      const expFromPlace = test.query.from.hasOwnProperty('place')
        ? test.query.from.place
        : test.query.from.name;
      const expToPlace = test.query.to.hasOwnProperty('place')
        ? test.query.to.place
        : test.query.to.name;

      let legsAreConnected = true;
      let walkDistanceIsCorrect = true;
      for (let pattern of json.trip.tripPatterns) {
        const noLegs = pattern.legs.length;
        // For trip start and stop
        test.query.from.hasOwnProperty('place')
          ? fromPlaces.push(pattern.legs[0].fromPlace.quay!.stopPlace!.id)
          : fromPlaces.push(pattern.legs[0].fromPlace.name!);
        test.query.to.hasOwnProperty('place')
          ? toPlaces.push(pattern.legs[noLegs - 1].toPlace.quay!.stopPlace!.id)
          : toPlaces.push(pattern.legs[noLegs - 1].toPlace.name!);
        // For connectivity on each trip (disregarding quay or not)
        let lastTo = '';
        let walkDistance = 0.0;
        pattern.legs.forEach((leg, index: number) => {
          leg.mode === 'foot'
            ? (walkDistance += leg.distance)
            : (walkDistance += 0.0);
          if (index === 0) {
            lastTo = leg.toPlace.name!;
          } else {
            if (leg.fromPlace.name !== lastTo) {
              legsAreConnected = false;
            }
            lastTo = leg.toPlace.name!;
          }
        });
        // For walk distance check
        if (Math.floor(pattern.walkDistance!) !== Math.floor(walkDistance)) {
          walkDistanceIsCorrect = false;
        }
      }
      expects.push(
        {
          check: 'should have correct from place',
          expect: fromPlaces.filter((e) => e !== expFromPlace).length === 0,
        },
        {
          check: 'should have correct to place',
          expect: toPlaces.filter((e) => e !== expToPlace).length === 0,
        },
        {check: 'should have connected legs', expect: legsAreConnected},
        {
          check: 'should have correct aggregated walk distance on legs',
          expect: walkDistanceIsCorrect,
        },
      );

      // Assert correct leg modes (for any given)
      if (test.expectedResult.legModes) {
        for (let expModes of test.expectedResult.legModes) {
          const responseLegModes = json.trip.tripPatterns[
            expModes.pattern
          ].legs.map((leg) => leg.mode);
          //console.log(`** ${testData.scenarios.indexOf(test)} ** ${expModes.pattern} ** ${responseLegModes} - ${expModes.modes}`)
          expects.push({
            check: `should have correct leg modes for trip pattern ${expModes.pattern}`,
            expect: isEqual(responseLegModes, expModes.modes),
          });
        }
      }

      // Assert number of trip patterns
      expects.push({
        check: `should have minimum number of trip patterns ${test.expectedResult.minimumTripPatterns}`,
        expect:
          json.trip.tripPatterns.length >=
          test.expectedResult.minimumTripPatterns,
      });

      metrics.checkForFailures(
        [res.request.url],
        res.timings.duration,
        requestName,
        expects,
      );
    } catch (exp) {
      metrics.checkForFailures(
        [res.request.url],
        res.timings.duration,
        requestName,
        [
          {
            check: `${exp}`,
            expect: false,
          },
        ],
      );
    }
  }
}

// Travel search request with next cursor (i.e. paging)
export function tripsWithCursor(
  testData: tripsTestDataType,
  searchDate: string,
  arriveBy: boolean = false,
) {
  const test = testData.scenarios[0];
  const searchTime = `${searchDate}T07:00:00.000Z`;
  const requestName = arriveBy
    ? `v2_tripsWithCursor_arriveBy`
    : `v2_tripsWithCursor_departAfter`;
  const url = `${conf.host()}/bff/v2/trips`;
  // Update the search time
  test.query.when = searchTime;
  // Update arriveBy
  test.query.arriveBy = arriveBy;

  const res = http.post(url, JSON.stringify(test.query), {
    tags: {name: requestName},
    headers: bffHeadersPost(),
  });

  const expects: ExpectsType = [
    {check: 'should have status 200', expect: res.status === 200},
  ];

  try {
    const json = res.json() as TripsQuery;

    // Update next request with cursor
    test.query.cursor = arriveBy
      ? json.trip.previousPageCursor
      : json.trip.nextPageCursor;
    const resNext = http.post(url, JSON.stringify(test.query), {
      tags: {name: requestName},
      headers: bffHeadersPost(),
    });
    // Remove cursor on object
    delete test.query.cursor;
    const jsonNext = resNext.json() as TripsQuery;

    expects.push({
      check: 'should have status 200 on next cursor',
      expect: resNext.status === 200,
    });

    // Assert returned time against expected times
    if (test.query.arriveBy) {
      expects.push(
        {
          check:
            'should have expected end times before requested time on initial request',
          expect: arrivesBeforeExpectedEndTime(
            json.trip.tripPatterns.map((pattern) => pattern.expectedEndTime),
            searchTime,
          ),
        },
        {
          check:
            'should have expected end times before requested time on next request',
          expect: arrivesBeforeExpectedEndTime(
            json.trip.tripPatterns.map((pattern) => pattern.expectedEndTime),
            searchTime,
          ),
        },
      );
    } else {
      expects.push(
        {
          check:
            'should have expected start times after requested time on initial request',
          expect: departsAfterExpectedStartTime(
            json.trip.tripPatterns.map((pattern) => pattern.expectedStartTime),
            searchTime,
          ),
        },
        {
          check:
            'should have expected start times after requested time on next request',
          expect: departsAfterExpectedStartTime(
            json.trip.tripPatterns.map((pattern) => pattern.expectedStartTime),
            searchTime,
          ),
        },
      );
    }

    // Assert sorted returned times on initial and next request
    if (test.query.arriveBy) {
      const expectedEndTimes = json.trip.tripPatterns
        .map((pattern) => pattern.expectedEndTime)
        .concat(
          jsonNext.trip.tripPatterns.map((pattern) => pattern.expectedEndTime),
        );
      expects.push({
        check: 'should have sorted expected end times in DESC order',
        expect: timeArrayIsSorted(expectedEndTimes, 'DESC'),
      });
    } else {
      const expectedStartTimes = json.trip.tripPatterns
        .map((pattern) => pattern.expectedStartTime)
        .concat(
          jsonNext.trip.tripPatterns.map(
            (pattern) => pattern.expectedStartTime,
          ),
        );
      expects.push({
        check: 'should have sorted expected start times in ASC order',
        expect: timeArrayIsSorted(expectedStartTimes, 'ASC'),
      });
    }

    // Assert correct start and stop on next request
    const fromPlaces = [];
    const toPlaces = [];
    const expFromPlace = test.query.from.hasOwnProperty('place')
      ? test.query.from.place
      : test.query.from.name;
    const expToPlace = test.query.to.hasOwnProperty('place')
      ? test.query.to.place
      : test.query.to.name;

    for (let pattern of jsonNext.trip.tripPatterns) {
      const noLegs = pattern.legs.length;
      // For trip start and stops
      test.query.from.hasOwnProperty('place')
        ? fromPlaces.push(pattern.legs[0].fromPlace.quay!.stopPlace!.id)
        : fromPlaces.push(pattern.legs[0].fromPlace.name);
      test.query.to.hasOwnProperty('place')
        ? toPlaces.push(pattern.legs[noLegs - 1].toPlace.quay!.stopPlace!.id)
        : toPlaces.push(pattern.legs[noLegs - 1].toPlace.name);
    }
    expects.push(
      {
        check: 'should have correct from place',
        expect: fromPlaces.filter((e) => e !== expFromPlace).length === 0,
      },
      {
        check: 'should have correct to place',
        expect: toPlaces.filter((e) => e !== expToPlace).length === 0,
      },
    );

    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration + resNext.timings.duration,
      requestName,
      expects,
    );
  } catch (exp) {
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false,
        },
      ],
    );
  }
}

// Travel search request - with filtering
export function filteredTrips(
  transportModes: transportModesType,
  searchDate: string,
  filterRequestName?: string,
): void {
  const searchTime = `${searchDate}T07:00:00.000Z`;
  const requestName = filterRequestName
    ? `v2_filteredTrips_${filterRequestName}`
    : `v2_filteredTrips`;
  const url = `${conf.host()}/bff/v2/trips`;
  const request: filteredTripsTestDataType = filteredTripsTestData;
  // Update the search time
  request.when = searchTime;
  // Set filters
  request.modes.transportModes = transportModes;
  const activeFiltersMode = transportModes.map((mode) => mode.transportMode);
  activeFiltersMode.push('foot');
  const activeFiltersSubmode = transportModes.flatMap(
    (mode) => mode.transportSubModes,
  );

  const res = http.post(url, JSON.stringify(request), {
    tags: {name: requestName},
    headers: bffHeadersPost(),
  });

  const expects: ExpectsType = [
    {check: 'should have status 200', expect: res.status === 200},
  ];

  try {
    const json: TripsQuery = res.json() as TripsQuery;

    // Assert returned time against expected times
    expects.push({
      check: 'should have expected start times after requested time',
      expect: departsAfterExpectedStartTime(
        json.trip.tripPatterns.map((pattern) => pattern.expectedStartTime),
        searchTime,
      ),
    });

    // Assert correct start and stop
    // Assert legs are connected
    // Assert aggregated walk distance is correct on each trip pattern
    const fromPlaces: string[] = [];
    const toPlaces: string[] = [];
    const expFromPlace = request.from.hasOwnProperty('place')
      ? request.from.place
      : request.from.name;
    const expToPlace = request.to.hasOwnProperty('place')
      ? request.to.place
      : request.to.name;

    let legsAreConnected = true;
    let walkDistanceIsCorrect = true;
    for (let pattern of json.trip.tripPatterns) {
      const noLegs = pattern.legs.length;
      // For trip start and stop
      request.from.hasOwnProperty('place')
        ? fromPlaces.push(pattern.legs[0].fromPlace.quay!.stopPlace!.id)
        : fromPlaces.push(pattern.legs[0].fromPlace.name!);
      request.to.hasOwnProperty('place')
        ? toPlaces.push(pattern.legs[noLegs - 1].toPlace.quay!.stopPlace!.id)
        : toPlaces.push(pattern.legs[noLegs - 1].toPlace.name!);
      // For connectivity on each trip (disregarding quay or not)
      let lastTo = '';
      let walkDistance = 0.0;
      pattern.legs.forEach((leg, index: number) => {
        leg.mode === 'foot'
          ? (walkDistance += leg.distance)
          : (walkDistance += 0.0);
        if (index === 0) {
          lastTo = leg.toPlace.name!;
        } else {
          if (leg.fromPlace.name !== lastTo) {
            legsAreConnected = false;
          }
          lastTo = leg.toPlace.name!;
        }
      });
      // For walk distance check
      if (Math.floor(pattern.walkDistance!) !== Math.floor(walkDistance)) {
        walkDistanceIsCorrect = false;
      }
    }
    expects.push(
      {
        check: 'should have correct from place',
        expect: fromPlaces.filter((e) => e !== expFromPlace).length === 0,
      },
      {
        check: 'should have correct to place',
        expect: toPlaces.filter((e) => e !== expToPlace).length === 0,
      },
      {check: 'should have connected legs', expect: legsAreConnected},
      {
        check: 'should have correct aggregated walk distance on legs',
        expect: walkDistanceIsCorrect,
      },
    );

    // Assert returned transport modes on active filters
    const responseModes = json.trip.tripPatterns.flatMap((pattern) =>
      pattern.legs.map((leg) => leg.mode),
    ) as string[];
    expects.push({
      check: `should have correct transport modes from active filters`,
      expect:
        responseModes.filter((mode) => !activeFiltersMode.includes(mode))
          .length === 0,
    });

    // Assert returned transport submodes on active filters
    const responseSubmodes = cleanSubmodes(
      json.trip.tripPatterns.flatMap((pattern) =>
        pattern.legs.map((leg) => leg.line?.transportSubmode),
      ) as string[],
    );
    expects.push({
      check: `should have correct transport submodes from active filters`,
      expect:
        responseSubmodes.filter((mode) => !activeFiltersSubmode.includes(mode))
          .length === 0,
    });

    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects,
    );
  } catch (exp) {
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false,
        },
      ],
    );
  }
}

// Remove undefined and unknown (for mode rail) submodes
const cleanSubmodes = (submodes: string[]): string[] => {
  const returnSubmodes: string[] = [];
  for (const submode of submodes) {
    if (
      submode !== undefined &&
      submode.length !== 0 &&
      submode !== 'unknown'
    ) {
      returnSubmodes.push(submode);
    }
  }
  return returnSubmodes;
};

// Single trip request
export function singleTrip(
  testData: singleTripsTestDataType,
  searchDate: string,
  arriveBy: boolean = false,
) {
  const requestName = 'v2_singleTrip';
  const searchTime = `${searchDate}T07:00:00.000Z`;
  const noSingleTripsToTest = 2;
  const urlTrips = `${conf.host()}/bff/v2/trips`;
  const urlSingleTrip = `${conf.host()}/bff/v2/singleTrip`;
  // Update the search time
  testData.query.when = searchTime;
  // Update arriveBy
  testData.query.arriveBy = arriveBy;

  const resTrips = http.post(urlTrips, JSON.stringify(testData.query), {
    tags: {name: requestName},
    headers: bffHeadersPost(),
  });

  const expects: ExpectsType = [
    {
      check: 'should have status 200 on /trips',
      expect: resTrips.status === 200,
    },
  ];

  try {
    const jsonTrips = resTrips.json() as TripsQuery;

    let noSingleTripsTested = 0;
    let singleTripDuration = 0.0;
    let counter = 0;
    while (noSingleTripsTested < noSingleTripsToTest) {
      const jsonTripsSingle = jsonTrips.trip.tripPatterns[
        counter
      ] as TripPatternWithCompressedQuery;

      // Note: Only foot pattern reduces start time with 1 minute, and compressed query from singleTrip reduces with even 1 minute more.
      const noLegs = jsonTripsSingle.legs.length;
      const firstLegMode = jsonTripsSingle.legs[0].mode;
      if (!(noLegs === 1 && firstLegMode === 'foot')) {
        const comprQuery = jsonTripsSingle.compressedQuery;
        const bodySingle = {compressedQuery: comprQuery};

        const resSingle = http.post(urlSingleTrip, JSON.stringify(bodySingle), {
          tags: {name: requestName},
          headers: bffHeadersPost(),
        });
        const jsonSingle = resSingle.json() as TripPatternWithCompressedQuery;

        // Note: The JSON-response is "randomly" ordered for each request. Pick out some test parameters.
        const tripsTest = [
          jsonTripsSingle.walkDistance,
          jsonTripsSingle.legs.length,
          jsonTripsSingle.legs.map((leg) => leg.mode),
        ];
        const singleTest = [
          jsonSingle.walkDistance,
          jsonSingle.legs.length,
          jsonTripsSingle.legs.map((leg) => leg.mode),
        ];
        // Have been issues where trip search is not equal to its single trip. Log when it happens
        if (!isEqual(tripsTest, singleTest)) {
          console.log(
            `*** ERROR tripsTest_${counter}: ${tripsTest.toString()}`,
          );
          console.log(
            `*** ERROR singleTest_${counter}: ${singleTest.toString()}`,
          );
          console.log(
            `*** Trip request body: ${JSON.stringify(testData.query)}`,
          );
        }

        expects.push(
          {
            check: `should have status 200 on /singleTrip #${counter}`,
            expect: resSingle.status === 200,
          },
          {
            check: `single trip details should be equal to trips results details #${counter}`,
            expect: isEqual(tripsTest, singleTest),
          },
          {
            check: `single trip duration should be equal to trips results duration #${counter}`,
            expect: durationIsEqual(
              jsonTripsSingle.duration,
              jsonSingle.duration,
              3,
            ),
          },
          {
            check: `single trip start time should be equal to trips results start time #${counter}`,
            expect: timeIsEqual(
              jsonTripsSingle.legs[0].aimedStartTime,
              jsonSingle.legs[0].aimedStartTime,
              120,
            ),
          },
        );
        noSingleTripsTested += 1;
      }
      counter += 1;
    }

    metrics.checkForFailures(
      [urlSingleTrip],
      resTrips.timings.duration + singleTripDuration,
      requestName,
      expects,
    );
  } catch (exp) {
    metrics.checkForFailures(
      [resTrips.request.url],
      resTrips.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false,
        },
      ],
    );
  }
}
