import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet } from '../../utils/headers.js';

export function stopsNearest(testData) {
  for (let test of testData.scenarios) {
    const requestName = `v2_stopsNearest_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v2/departures/stops-nearest?count=10&distance=${
      test.query.distance
    }&latitude=${test.query.lat}&longitude=${test.query.lon}`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 },
      {
        check: 'should have correct number of stop places',
        expect:
          res.json(`nearest.edges`).length ===
          test.expectedResult.stopPlaces.length
      },
      {
        check: 'should have correct stop places',
        expect:
          res.json(`nearest.edges.#.node.place.id`).toString() ===
          test.expectedResult.stopPlaces.toString()
      }
    ];
    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}

export function stopsDetails(testData) {
  for (let test of testData.scenarios) {
    const requestName = `v2_stopsDetails_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v2/departures/stops-details?ids=${test.query.stopPlaceIds.join(
      '&ids='
    )}`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];
    // Assert per stop place returned
    for (let expResult of test.expectedResults) {
      // Names and ids
      let resStopPlaceNames = res
        .json(`stopPlaces.#(id="${expResult.stopPlaceId}")#.name`)
        .toString();
      let resQuayIds = res
        .json(`stopPlaces.#(id="${expResult.stopPlaceId}")#.quays.#.id`)[0]
        .sort()
        .toString();
      let expQuayIds = expResult.quays
        .map(e => e.id)
        .sort()
        .toString();
      expects.push(
        {
          check: `stop place name should be ${expResult.stopPlaceName}`,
          expect: resStopPlaceNames === expResult.stopPlaceName
        },
        {
          check: `should have correct quays for stop place '${expResult.stopPlaceId}'`,
          expect: resQuayIds === expQuayIds
        }
      );

      // Public code and description
      for (let expQuay of expResult.quays) {
        if (expQuay.publicCode !== null) {
          let resQuayPC = res
            .json(
              `stopPlaces.#(id="${expResult.stopPlaceId}")#.quays.#(id="${expQuay.id}")#.publicCode`
            )
            .toString();
          expects.push({
            check: `public code should be '${expQuay.publicCode}' for '${expQuay.id}'`,
            expect: resQuayPC === expQuay.publicCode
          });
        }
        if (expQuay.description !== null) {
          let resQuayDesc = res
            .json(
              `stopPlaces.#(id="${expResult.stopPlaceId}")#.quays.#(id="${expQuay.id}")#.description`
            )
            .toString();
          expects.push({
            check: `description should be '${expQuay.description}' for '${expQuay.id}'`,
            expect: resQuayDesc === expQuay.description
          });
        }
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
