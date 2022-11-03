import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet } from '../../utils/headers.js';
import { departsAfterExpectedStartTime } from '../../utils/utils.js';

export function quayDepartures(quayId, startDate, limit = 5) {
  const requestName = 'v1_quayDepartures';
  // NB! Doesn't seem that the time is "working", but looks away since this endpoint doesn't seem to be used
  //let startTime = startDate + 'T08:00:00.000Z'
  //let url = `${conf.host()}/bff/v1/quay/${quayId}/departures?limit=${limit}&start=${startTime}&timeRange=86400&includeNonBoarding=false`;
  let startTime = new Date(Date.now()).toISOString();
  let url = `${conf.host()}/bff/v1/quay/${quayId}/departures?limit=${limit}&timeRange=86400&includeNonBoarding=false`;

  let res = http.get(url, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });

  let expects = [
    { check: 'should have status 200', expect: res.status === 200 },
    {
      check: 'should show correct quay',
      expect: res.json('@this.#.quay.id').filter(e => e !== quayId).length === 0
    },
    {
      check: 'should have expected departure times after requested time',
      expect: departsAfterExpectedStartTime(
        res.json('@this.#.expectedDepartureTime')
      )
    },
    {
      check: 'should have aimed departure times after requested time',
      expect: departsAfterExpectedStartTime(
        res.json('@this.#.aimedDepartureTime'),
        startTime
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
