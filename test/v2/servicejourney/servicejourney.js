import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers.js';
import { isEqual, useNoDecimals } from '../../utils/utils.js';

export function serviceJourneyDepartures(testData, searchDate) {
  let searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = `v2_serviceJourneyDepartures_${testData.scenarios.indexOf(
      test
    )}`;

    // Get service journey id
    let urlTrip = `${conf.host()}/bff/v2/trips`;
    test.query.when = searchTime;
    let resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      bffHeaders: bffHeadersPost
    });
    let tripNumber =
      resTrip.json('trip.tripPatterns.0.legs.0.mode') === 'bus' ? 0 : 1;
    let serviceJourneyId = resTrip.json(
      `trip.tripPatterns.${tripNumber}.legs.0.serviceJourney.id`
    );

    let urlSJD = `${conf.host()}/bff/v2/servicejourney/${serviceJourneyId}/departures?date=${searchDate}`;
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

    // Assert service journey id
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
    // Assert expected start time from travel search
    let expStartTime = resTrip.json(
      `trip.tripPatterns.${tripNumber}.legs.0.expectedStartTime`
    );
    expects.push({
      check: 'should have correct expected start time',
      expect: resSJD
        .json('value.#.expectedDepartureTime')
        .includes(expStartTime)
    });

    metrics.addFailureIfMultipleChecks(
      [resTrip.request.url, resSJD.request.url],
      resTrip.timings.duration + resSJD.timings.duration,
      requestName,
      expects
    );
  }
}

// Polyline for a service journey
// Testdata is from start to end
export function polyline(testData, searchDate) {
  let startTime = `${searchDate}T08:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = 'v2_polyline';
    let urlTrip = `${conf.host()}/bff/v2/trips`;
    // Update the search time
    test.query.when = startTime;

    let resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      bffHeaders: bffHeadersPost
    });

    let expects = [
      {
        check: 'should have status 200 on /trip',
        expect: resTrip.status === 200
      }
    ];

    let urlList = [urlTrip];
    let polylineDuration = 0.0;
    // Walk through the trip patterns
    for (let trip of resTrip.json('trip.tripPatterns')) {
      // Only consider direct busses
      if (trip.legs.length === 1 && trip.legs[0].mode === 'bus') {
        let fromCoords = [
          useNoDecimals(trip.legs[0].fromPlace.latitude, 2),
          useNoDecimals(trip.legs[0].fromPlace.longitude, 2)
        ];
        let toCoords = [
          useNoDecimals(trip.legs[0].toPlace.latitude, 2),
          useNoDecimals(trip.legs[0].toPlace.longitude, 2)
        ];
        let serviceJourney = trip.legs[0].serviceJourney.id;
        let fromQuay = trip.legs[0].fromPlace.quay.id;
        let toQuay = trip.legs[0].toPlace.quay.id;

        // Only from
        let urlPolyline = `${conf.host()}/bff/v2/servicejourney/${serviceJourney}/polyline?fromQuayId=${fromQuay}`;
        // Both from and to
        let urlPolyline2 = `${conf.host()}/bff/v2/servicejourney/${serviceJourney}/polyline?fromQuayId=${fromQuay}&toQuayId=${toQuay}`;
        urlList.push(urlPolyline, urlPolyline2);

        let resPolyline = http.get(urlPolyline, {
          tags: { name: requestName },
          bffHeaders: bffHeadersGet
        });
        polylineDuration += resPolyline.timings.duration;
        let resPolyline2 = http.get(urlPolyline2, {
          tags: { name: requestName },
          bffHeaders: bffHeadersGet
        });
        polylineDuration += resPolyline2.timings.duration;

        let startCoordsPolyline = [
          useNoDecimals(resPolyline.json('start.latitude'), 2),
          useNoDecimals(resPolyline.json('start.longitude'), 2)
        ];
        let stopCoordsPolyline = [
          useNoDecimals(resPolyline.json('stop.latitude'), 2),
          useNoDecimals(resPolyline.json('stop.longitude'), 2)
        ];
        let startCoordsPolyline2 = [
          useNoDecimals(resPolyline2.json('start.latitude'), 2),
          useNoDecimals(resPolyline2.json('start.longitude'), 2)
        ];
        let stopCoordsPolyline2 = [
          useNoDecimals(resPolyline2.json('stop.latitude'), 2),
          useNoDecimals(resPolyline2.json('stop.longitude'), 2)
        ];

        expects.push(
          {
            check: 'should have status 200 on /polyline',
            expect: resPolyline.status === 200 && resPolyline2.status === 200
          },
          {
            check: 'should have correct start coordinates with from',
            expect: isEqual(fromCoords, startCoordsPolyline)
          },
          {
            check: 'should have correct start coordinates with from and to',
            expect: isEqual(fromCoords, startCoordsPolyline2)
          },
          {
            check: 'should have correct stop coordinates with from',
            expect: isEqual(toCoords, stopCoordsPolyline)
          },
          {
            check: 'should have correct stop coordinates with from and to',
            expect: isEqual(toCoords, stopCoordsPolyline2)
          }
        );
      }
    }
    metrics.addFailureIfMultipleChecks(
      urlList,
      resTrip.timings.duration + polylineDuration,
      requestName,
      expects
    );
  }
}
