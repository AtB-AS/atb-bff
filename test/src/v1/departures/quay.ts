import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersGet } from '../../utils/headers';
import { departsAfterExpectedStartTime } from '../../utils/utils';
import { JSONArray } from 'k6';

export function quayDepartures(quayId: string, limit: number = 5) {
  const requestName = 'v1_quayDepartures';
  // NB! Doesn't seem that the time is "working", but looks away since this endpoint doesn't seem to be used
  //let startTime = startDate + 'T08:00:00.000Z'
  //let url = `${conf.host()}/bff/v1/quay/${quayId}/departures?limit=${limit}&start=${startTime}&timeRange=86400&includeNonBoarding=false`;
  const startTime = new Date(Date.now()).toISOString();
  const url = `${conf.host()}/bff/v1/quay/${quayId}/departures?limit=${limit}&timeRange=86400&includeNonBoarding=false`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  const expects: ExpectsType = [
    { check: 'should have status 200', expect: res.status === 200 },
    {
      check: 'should show correct quay',
      expect:
        (res.json('@this.#.quay.id') as JSONArray).filter(e => e !== quayId)
          .length === 0
    },
    {
      check: 'should have expected departure times after requested time',
      expect: departsAfterExpectedStartTime(
        res.json('@this.#.expectedDepartureTime') as string[],
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