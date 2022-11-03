import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers.js';
import { isEqual, useNoDecimals } from '../../utils/utils.js';

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

        let urlPolyline = `${conf.host()}/bff/v2/servicejourney/${serviceJourney}/polyline?fromQuayId=${fromQuay}`;
        urlList.push(urlPolyline);

        let resPolyline = http.get(urlPolyline, {
          tags: { name: requestName },
          bffHeaders: bffHeadersGet
        });
        polylineDuration += resPolyline.timings.duration;

        let startCoordsPolyline = [
          useNoDecimals(resPolyline.json('start.latitude'), 2),
          useNoDecimals(resPolyline.json('start.longitude'), 2)
        ];
        let stopCoordsPolyline = [
          useNoDecimals(resPolyline.json('stop.latitude'), 2),
          useNoDecimals(resPolyline.json('stop.longitude'), 2)
        ];

        expects.push(
          {
            check: 'should have status 200 on /polyline',
            expect: resPolyline.status === 200
          },
          {
            check: 'should have correct start coordinates',
            expect: isEqual(fromCoords, startCoordsPolyline)
          },
          {
            check: 'should have correct stop coordinates',
            expect: isEqual(toCoords, stopCoordsPolyline)
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
