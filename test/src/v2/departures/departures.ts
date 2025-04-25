import http from 'k6/http';
import {conf, ExpectsType, metrics} from '../../config/configuration';
import {bffHeadersPost} from '../../utils/headers';
import {isEqual} from '../../utils/utils';
import {DeparturesQuery} from '../../../../src/service/impl/departures/journey-gql/departures.graphql-gen';

export function departures(
  quayIds: string[],
  startDate: string,
  timeRange: number = 86400,
  limit: number = 1000,
) {
  const requestName = 'v2_departures';
  const quayIdParams = quayIds.join('&ids=');
  const url = `${conf.host()}/bff/v2/departures/departures?ids=${quayIdParams}&numberOfDepartures=${limit}&startTime=${startDate}T03:00:00.000Z&timeRange=${timeRange}`;

  const res = http.post(url, '{}', {
    tags: {name: requestName},
    headers: bffHeadersPost(),
  });

  const expects: ExpectsType = [
    {check: 'should have status 200', expect: res.status === 200},
  ];

  try {
    const json = res.json() as DeparturesQuery;

    expects.push(
      {
        check: 'should have correct number of quays',
        expect: json.quays.length === quayIds.length,
      },
      {
        check: 'should include correct quayIds',
        expect: isEqual(
          json.quays.flatMap((quay) => quay.id),
          quayIds,
        ),
      },
      {
        check: 'should have departures on correct date',
        expect:
          json.quays.flatMap((quay) =>
            quay.estimatedCalls.filter((call) => call.date !== startDate),
          ).length === 0,
      },
    );
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects,
    );
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false,
        },
      ],
    );
  }
}
