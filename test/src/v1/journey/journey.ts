import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers';
import {
  arrivesBeforeExpectedEndTime,
  departsAfterExpectedStartTime
} from '../../utils/utils';
import {
  tripTestDataType,
  TripsSimplifiedResponseType,
  TripsSingleSimplifiedResponseType
} from '../types';

export function trip(
  testData: tripTestDataType,
  searchDate: string,
  arriveBy: boolean
) {
  const searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = arriveBy
      ? `v1_trip_arriveBy_${testData.scenarios.indexOf(test)}`
      : `v1_trip_departAfter_${testData.scenarios.indexOf(test)}`;
    const url = `${conf.host()}/bff/v1/journey/trip`;
    // Update the search time
    test.query.searchDate = searchTime;
    // Update arriveBy
    test.query.arriveBy = arriveBy;

    const res = http.post(url, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });
    const tripsJson = res.json() as TripsSimplifiedResponseType;

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    // Assert returned time against expected times
    if (test.query.arriveBy) {
      expects.push({
        check: 'should have expected end times before requested time',
        expect: arrivesBeforeExpectedEndTime(
          tripsJson.map(trip => trip.expectedEndTime),
          searchTime
        )
      });
    } else {
      expects.push({
        check: 'should have expected start times after requested time',
        expect: departsAfterExpectedStartTime(
          tripsJson.map(trip => trip.expectedStartTime),
          searchTime
        )
      });
    }

    // Assert correct start and stop
    const fromName: string[] = [];
    const toName: string[] = [];
    const expFromName = test.query.from.name;
    const expToName = test.query.to.name;

    for (let trip of tripsJson) {
      const noLegs: number = trip.legs.length;
      fromName.push(trip.legs[0].fromPlace.name);
      toName.push(trip.legs[noLegs - 1].toPlace.name);
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

export function singleTrip(testData: tripTestDataType, searchDate: string) {
  const test = testData.scenarios[0];
  const searchTime = `${searchDate}T10:00:00.000Z`;
  const requestName = 'v1_singleTrip';
  // Update the query
  test.query.searchDate = searchTime;
  test.query.limit = 1;
  test.query.arriveBy = false;

  const urlTrip = `${conf.host()}/bff/v1/journey/trip`;
  const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
    tags: { name: requestName },
    headers: bffHeadersPost
  });
  const jsonTrip = resTrip.json() as TripsSimplifiedResponseType;
  const singleTripId = resTrip.json('@this.0.id') as string;
  const urlSingleTrip = `${conf.host()}/bff/v1/journey/single-trip?id=${singleTripId}`;
  const resSingleTrip = http.get(urlSingleTrip, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });
  const jsonSingleTrip = resSingleTrip.json() as TripsSingleSimplifiedResponseType;

  const expects: ExpectsType = [
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
      expect: jsonTrip[0].expectedStartTime === jsonSingleTrip.expectedStartTime
    },
    {
      check: 'should have same total distance',
      expect: jsonTrip[0].distance === jsonSingleTrip.distance
    },
    {
      check: 'should have same service journey on the first leg',
      expect:
        jsonTrip[0].legs[0].serviceJourney.id ===
        jsonSingleTrip.legs[0].serviceJourney.id
    }
  );

  metrics.addFailureIfMultipleChecks(
    [resTrip.request.url, resSingleTrip.request.url],
    resTrip.timings.duration + resSingleTrip.timings.duration,
    requestName,
    expects
  );
}
