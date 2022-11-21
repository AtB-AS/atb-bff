import http from 'k6/http';
import { ExpectsType, conf, metrics } from '../../config/configuration';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers';
import { serviceJourneyTestDataType } from '../types';
import { JSONArray, JSONValue } from 'k6';

export const serviceJourneyDepartures = (
  testData: serviceJourneyTestDataType,
  searchDate: string
): void => {
  let searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = `v1_serviceJourneyDepartures_${testData.scenarios.indexOf(
      test
    )}`;

    // Get service journey id
    const urlTrip = `${conf.host()}/bff/v1/journey/trip`;
    test.query.searchDate = searchTime;
    const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });
    const serviceJourneyId = resTrip.json(
      '@this.0.legs.0.serviceJourney.id'
    ) as string;

    const urlSJD = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/departures?date=${searchDate}`;
    const resSJD = http.get(urlSJD, {
      tags: { name: requestName },
      headers: bffHeadersGet
    });

    const expects: ExpectsType = [
      {
        check: 'should have status 200 on /trip',
        expect: resTrip.status === 200
      },
      {
        check: 'should have status 200 on /servicejourney',
        expect: resSJD.status === 200
      }
    ];

    // Assert
    expects.push(
      {
        check: 'should have departures',
        expect: (resSJD.json('value.#') as number) > 0
      },
      {
        check: 'should only have departures for the service journey',
        expect:
          (resSJD.json('value.#.serviceJourney.id') as JSONArray).filter(
            (e: JSONValue) => (e as string) !== serviceJourneyId
          ).length === 0
      }
    );

    metrics.addFailureIfMultipleChecks(
      [resTrip.request.url, resSJD.request.url],
      resTrip.timings.duration + resSJD.timings.duration,
      requestName,
      expects
    );
  }
};

export function serviceJourneyPolyline(
  testData: serviceJourneyTestDataType,
  searchDate: string
) {
  for (let test of testData.scenarios) {
    const searchTime = `${searchDate}T10:00:00.000Z`;
    const requestName = `v1_serviceJourneyPolyline_${testData.scenarios.indexOf(
      test
    )}`;

    // Get necessary parameters
    const urlTrip = `${conf.host()}/bff/v1/journey/trip`;
    test.query.searchDate = searchTime;
    const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersGet
    });
    const serviceJourneyId = resTrip.json(
      '@this.0.legs.0.serviceJourney.id'
    ) as string;
    const fromQuayId = resTrip.json(
      '@this.0.legs.0.fromPlace.quay.id'
    ) as string;
    const toQuayId = resTrip.json('@this.0.legs.0.toPlace.quay.id') as string;

    // Both to and from
    const urlPoly = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/polyline?fromQuayId=${fromQuayId}&toQuayId=${toQuayId}`;
    const resPoly = http.get(urlPoly, {
      tags: { name: requestName },
      headers: bffHeadersGet
    });
    // Only from
    const urlPoly2 = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/polyline?fromQuayId=${fromQuayId}`;
    const resPoly2 = http.get(urlPoly2, {
      tags: { name: requestName },
      headers: bffHeadersGet
    });

    const expects: ExpectsType = [
      {
        check: 'should have status 200 on /trip',
        expect: resTrip.status === 200
      },
      {
        check: 'should have status 200 on /polyline',
        expect: resPoly.status === 200 && resPoly2.status === 200
      },
      {
        check: 'should have map legs from /polyline',
        expect:
          (resPoly.json('mapLegs.#') as number) > 0 &&
          (resPoly2.json('mapLegs.#') as number) > 0
      }
    ];

    metrics.addFailureIfMultipleChecks(
      [resTrip.request.url, resPoly.request.url, resPoly2.request.url],
      resTrip.timings.duration +
        resPoly.timings.duration +
        resPoly2.timings.duration,
      requestName,
      expects
    );
  }
}
