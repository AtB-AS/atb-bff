import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers.js';
import { isEqual } from '../../utils/utils.js';

export function departuresGrouped(testData, startDate, limit = 5) {
  for (let test of testData.scenarios) {
    const requestName = `v1_departuresGrouped_${testData.scenarios.indexOf(
      test
    )}`;
    let url = `${conf.host()}/bff/v1/departures-grouped?limitPerLine=${limit}&startTime=${startDate}T08:00:00.000Z`;

    let res = http.post(url, JSON.stringify(test.query), {
      tags: { name: requestName },
      bffHeaders: bffHeadersPost
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    // Assert correct stop place
    let stopPlaces = res.json('data.#.stopPlace.id').sort();
    let stopPlacesExp = test.expectedResults.flatMap(e => e.stopPlace).sort();
    expects.push({
      check: 'should have correct stop place',
      expect: isEqual(stopPlaces, stopPlacesExp)
    });
    // Assert correct quays
    for (let expResult of test.expectedResults) {
      let quays = res
        .json(`data.#(stopPlace.id=="${expResult.stopPlace}")#.quays.#.quay.id`)
        .sort();
      expects.push({
        check: `should have correct quays for stop place "${expResult.stopPlace}"`,
        expect: isEqual(quays, expResult.quays)
      });
    }

    // Assert has departures
    for (let expResult of test.expectedResults) {
      if (expResult.shouldHaveDepartures) {
        let sum = 0;
        // This json path becomes a nested array
        res
          .json(
            `data.#(stopPlace.id=="${expResult.stopPlace}")#.quays.#.group.#.departures`
          )
          .forEach(qu =>
            qu.forEach(gr => gr.forEach(dep => (sum += dep.length)))
          );
        expects.push({
          check: `should have departures for stop place "${expResult.stopPlace}"`,
          expect: sum > 0
        });
      }
    }

    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}

export function departuresRealtime(quayId, startDate, limit = 5) {
  const requestName = 'v1_departuresRealtime';
  const startTime = startDate + 'T08:00:00.000Z';
  let url = `${conf.host()}/bff/v1/departures-realtime?quayIds=${quayId}&limit=${limit}&startTime=${startTime}`;

  let res = http.get(url, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });

  let firstExpDeparture = res.json(
    `${quayId}.departures.ATB*.timeData.expectedDepartureTime`
  );
  let expects = [
    { check: 'should have status 200', expect: res.status === 200 },
    {
      check: 'should show correct quay',
      expect: res.json(`${quayId}.quayId`) === quayId
    },
    {
      check: 'should have expected start times after requested time',
      expect: Date.parse(firstExpDeparture) > Date.parse(startTime)
    }
  ];

  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}
