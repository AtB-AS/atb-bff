import {conf, ExpectsType, metrics} from '../../config/configuration';
import http from 'k6/http';
import {bffHeadersGet} from '../../utils/headers';

export function oldAppVersion(appVersion: string) {
  const requestName = 'v2_oldAppVersion';
  const searchTime = new Date().toISOString();
  const url = `${conf.host()}/bff/v2/departures/realtime?quayIds=NSR:Quay:71181&startTime=${searchTime}&timeRange=86400&limit=10`;

  const resCurrent = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGet(),
  });

  const bffHeadersGetOldVersion = JSON.parse(JSON.stringify(bffHeadersGet()));
  bffHeadersGetOldVersion['atb-app-version'] = appVersion;
  const resOld = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGetOldVersion,
  });

  const expects: ExpectsType = [
    {
      check: 'should have status 200',
      expect: resCurrent.status === 200,
    },
    {
      check: 'should have status 406',
      expect: resOld.status === 406,
    },
  ];

  metrics.checkForFailures(
    [resCurrent.request.url],
    resCurrent.timings.duration + resOld.timings.duration,
    requestName,
    expects,
  );
}
