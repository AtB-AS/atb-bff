import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet } from '../../utils/headers.js';

export function geocoderFeatures(testData, limit = 10) {
  for (let test of testData.scenarios) {
    const requestName = `v1_geocoderFeatures_${testData.scenarios.indexOf(
      test
    )}`;
    let latitude = test.query.latitude;
    let longitude = test.query.longitude;
    let searchString = encodeURI(test.query.searchString);
    let url = `${conf.host()}/bff/v1/geocoder/features?lat=${latitude}&limit=${limit}&lon=${longitude}&query=${searchString}`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    // Asserts
    for (let expResult of test.expectedResults) {
      expects.push(
        {
          check: `should include "${expResult.id}"`,
          expect: res.json(`@this.#.properties.id`).includes(expResult.id)
        },
        {
          check: `should have correct name for "${expResult.id}"`,
          expect:
            res
              .json(`@this.#(properties.id="${expResult.id}")#.properties.name`)
              .toString() === expResult.name
        },
        {
          check: `should include category "${expResult.category}" for "${expResult.id}"`,
          expect: res
            .json(
              `@this.#(properties.id="${expResult.id}")#.properties.category|@flatten`
            )
            .includes(expResult.category)
        }
      );
    }

    // Assert if more hits
    if (test.moreResults) {
      expects.push({
        check: `should have more hits than ${test.expectedResults.length}`,
        expect: res.json(`@this.#`) > test.expectedResults.length
      });
    }

    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}

export function geocoderReverse(testData, radius = 1000) {
  for (let test of testData.scenarios) {
    const requestName = `v1_geocoderReverse_${testData.scenarios.indexOf(
      test
    )}`;
    let latitude = test.query.latitude;
    let longitude = test.query.longitude;
    let url = `${conf.host()}/bff/v1/geocoder/reverse?lat=${latitude}&lon=${longitude}&radius=${radius}`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    // Asserts
    for (let expResult of test.expectedResults) {
      expects.push(
        {
          check: `should include "${expResult.id}"`,
          expect: res.json(`@this.#.properties.id`).includes(expResult.id)
        },
        {
          check: `should have correct name for "${expResult.id}"`,
          expect:
            res
              .json(`@this.#(properties.id="${expResult.id}")#.properties.name`)
              .toString() === expResult.name
        },
        {
          check: `should include category "${expResult.category}" for "${expResult.id}"`,
          expect: res
            .json(
              `@this.#(properties.id="${expResult.id}")#.properties.category|@flatten`
            )
            .includes(expResult.category)
        }
      );
    }

    // Assert if more hits
    if (test.moreResults) {
      expects.push({
        check: `should have more hits than ${test.expectedResults.length}`,
        expect: res.json(`@this.#`) > test.expectedResults.length
      });
    }

    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}
