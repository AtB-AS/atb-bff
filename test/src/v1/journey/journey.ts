import http from 'k6/http';
import {conf, ExpectsType, metrics} from '../../config/configuration';
import {bffHeadersPost} from '../../utils/headers';
import {
  arrivesBeforeExpectedEndTime,
  departsAfterExpectedStartTime,
} from '../../utils/utils';
import {tripTestDataType, TripsSimplifiedResponseType} from '../types';

export function trip(
  testData: tripTestDataType,
  searchDate: string,
  arriveBy: boolean,
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
      tags: {name: requestName},
      headers: bffHeadersPost,
    });

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];

    try {
      const tripsJson = res.json() as TripsSimplifiedResponseType;

      // Assert returned time against expected times
      if (test.query.arriveBy) {
        expects.push({
          check: 'should have expected end times before requested time',
          expect: arrivesBeforeExpectedEndTime(
            tripsJson.map((trip) => trip.expectedEndTime),
            searchTime,
          ),
        });
      } else {
        expects.push({
          check: 'should have expected start times after requested time',
          expect: departsAfterExpectedStartTime(
            tripsJson.map((trip) => trip.expectedStartTime),
            searchTime,
          ),
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
          expect: fromName.filter((e) => e !== expFromName).length === 0,
        },
        {
          check: 'should have correct to names',
          expect: toName.filter((e) => e !== expToName).length === 0,
        },
      );

      metrics.checkForFailures(
        [res.request.url],
        res.timings.duration,
        requestName,
        expects,
      );
    } catch (exp) {
      //throw exp
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
