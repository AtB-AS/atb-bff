import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet } from '../../utils/headers.js';
import { isEqual } from '../../utils/utils.js';

export function stopDetails(testData) {
  for (let test of testData.scenarios) {
    const requestName = `v1_stopDetails_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v1/stop/${test.query.stopPlace}`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 },
      {
        check: 'should give correct stop place',
        expect: res.json('id') === test.expectedResult.stopPlace
      },
      {
        check: 'should have correct name',
        expect: res.json('name') === test.expectedResult.name
      },
      {
        check: 'should have correct quays',
        expect: isEqual(
          res.json('quays.#.id').sort(),
          test.expectedResult.quays.sort()
        )
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

export function stopQuays(testData) {
  for (let test of testData.scenarios) {
    const requestName = `v1_stopQuays_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v1/stop/${
      test.query.stopPlace
    }/quays?filterByInUse=true`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 },
      {
        check: 'should give correct stop place',
        expect:
          res
            .json('@this.#.stopPlace.id')
            .filter(e => e !== test.expectedResult.stopPlace).length === 0
      },
      {
        check: 'should have correct name',
        expect:
          res
            .json('@this.#.stopPlace.name')
            .filter(e => e !== test.expectedResult.name).length === 0
      },
      {
        check: 'should have correct quays',
        expect: isEqual(
          res.json('@this.#.id').sort(),
          test.expectedResult.quays.sort()
        )
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
