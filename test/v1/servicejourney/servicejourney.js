import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet } from '../../utils/headers.js';

export function serviceJourneyDepartures(testData, searchDate) {
  let searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = `v1_serviceJourneyDepartures_${testData.scenarios.indexOf(
      test
    )}`;

    // Get service journey id
    let urlTrip = `${conf.host()}/bff/v1/journey/trip`;
    test.query.searchDate = searchTime;
    let resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });
    let serviceJourneyId = resTrip.json('@this.0.legs.0.serviceJourney.id');

    let urlSJD = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/departures?date=${searchDate}`;
    let resSJD = http.get(urlSJD, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
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
      { check: 'should have departures', expect: resSJD.json('value.#') > 0 },
      {
        check: 'should only have departures for the service journey',
        expect:
          resSJD
            .json('value.#.serviceJourney.id')
            .filter(e => e !== serviceJourneyId).length === 0
      }
    );

    metrics.addFailureIfMultipleChecks(
      [resTrip.request.url, resSJD.request.url],
      resTrip.timings.duration + resSJD.timings.duration,
      requestName,
      expects
    );
  }
}

export function serviceJourneyPolyline(testData, searchDate) {
  for (let test of testData.scenarios) {
    let searchTime = `${searchDate}T10:00:00.000Z`;
    const requestName = `v1_serviceJourneyPolyline_${testData.scenarios.indexOf(
      test
    )}`;

    // Get necessary parameters
    let urlTrip = `${conf.host()}/bff/v1/journey/trip`;
    test.query.searchDate = searchTime;
    let resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });
    let serviceJourneyId = resTrip.json('@this.0.legs.0.serviceJourney.id');
    let fromQuayId = resTrip.json('@this.0.legs.0.fromPlace.quay.id');
    let toQuayId = resTrip.json('@this.0.legs.0.toPlace.quay.id');

    let urlPoly = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/polyline?fromQuayId=${fromQuayId}&toQuayId=${toQuayId}`;
    let resPoly = http.get(urlPoly, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      {
        check: 'should have status 200 on /trip',
        expect: resTrip.status === 200
      },
      {
        check: 'should have status 200 on /polyline',
        expect: resPoly.status === 200
      },
      {
        check: 'should have map legs from /polyline',
        expect: resPoly.json('mapLegs.#') > 0
      }
    ];

    metrics.addFailureIfMultipleChecks(
      [resTrip.request.url, resPoly.request.url],
      resTrip.timings.duration + resPoly.timings.duration,
      requestName,
      expects
    );
  }
}
