import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers';
import { isEqual } from '../../utils/utils';
import { JSONObject } from 'k6';
import { QuayDeparturesQuery } from '../../../../src/service/impl/departures/journey-gql/quay-departures.graphql-gen';
import { StopPlaceQuayDeparturesQuery } from '../../../../src/service/impl/departures/journey-gql/stop-departures.graphql-gen';

export function stopDepartures(
  stopId: string,
  startDate: string,
  timeRange: number = 86400,
  limit: number = 10
) {
  const requestName = 'v2_stopDepartures';
  const url = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  const res = http.post(url, '{}', {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  const expects: ExpectsType = [
    {
      check: 'should have status 200',
      expect: res.status === 200
    }
  ];

  try {
    const json = res.json() as StopPlaceQuayDeparturesQuery;

    expects.push(
      {
        check: 'should have correct stopId',
        expect: json.stopPlace!.id === stopId
      },
      {
        check: 'should have correct number of quays',
        expect: json.stopPlace!.quays!.length === 2
      },
      {
        check: 'should only include start date quay 1',
        expect:
          json
            .stopPlace!.quays!.map(quay => quay.estimatedCalls[0].date)
            .filter(date => date !== startDate).length === 0
      }
    );
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
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
          expect: false
        }
      ]
    );
  }
}

export function stopDeparturesPOSTandGET(
  stopId: string,
  startDate: string,
  timeRange = 86400,
  limit = 10
) {
  const requestName = 'v2_stopDeparturesPOSTandGET';
  const url = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  const resGET = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });
  const resPOST = http.post(url, '{}', {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  try {
    const expects: ExpectsType = [
      { check: 'should have status 200', expect: resGET.status === 200 },
      { check: 'should have status 200', expect: resPOST.status === 200 },
      {
        check: 'should have equal responses',
        expect:
          (resGET.json() as JSONObject).toString() ===
          (resPOST.json() as JSONObject).toString()
      }
    ];
    metrics.checkForFailures(
      [resGET.request.url],
      resGET.timings.duration + resPOST.timings.duration,
      requestName,
      expects
    );
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [resGET.request.url],
      resGET.timings.duration + resPOST.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false
        }
      ]
    );
  }
}

// Check that stop departures corresponds to the individual quay departures
export function quayDeparturesVsStopDepartures(
  stopId: string,
  startDate: string
) {
  const requestName = 'v2_quayDeparturesVsStopDepartures';
  const urlSD = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;

  const resSD = http.post(urlSD, '{}', {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  try {
    const jsonSD = resSD.json() as StopPlaceQuayDeparturesQuery;

    // Check equality on each quay
    const quays = jsonSD.stopPlace!.quays!.map(el => el.id);
    for (let quay of quays) {
      const urlQD = `${conf.host()}/bff/v2/departures/quay-departures?id=${quay}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;
      const resQD = http.post(urlQD, '{}', {
        tags: { name: requestName },
        headers: bffHeadersPost
      });
      const jsonQD = resQD.json() as QuayDeparturesQuery;

      const expects: ExpectsType = [
        { check: 'should have status 200', expect: resSD.status === 200 },
        { check: 'should have status 200', expect: resQD.status === 200 },
        {
          check: 'should return same quay departures',
          expect: isEqual(
            jsonSD.stopPlace!.quays!.filter(quayEl => quayEl.id === quay)[0]
              .estimatedCalls,
            jsonQD.quay?.estimatedCalls!
          )
        }
      ];
      metrics.checkForFailures(
        [resSD.request.url, resQD.request.url],
        resSD.timings.duration + resQD.timings.duration,
        `${requestName}_${quay}`,
        expects
      );
    }
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [resSD.request.url],
      resSD.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false
        }
      ]
    );
  }
}

export function quayDepartures(
  quayId: string,
  startDate: string,
  timeRange: number = 86400,
  limit: number = 1000
) {
  const requestName = 'v2_quayDepartures';
  const url = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  const res = http.post(url, '{}', {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  const expects: ExpectsType = [
    { check: 'should have status 200', expect: res.status === 200 }
  ];

  try {
    const json = res.json() as QuayDeparturesQuery;

    expects.push(
      {
        check: 'should have correct quayId',
        expect: json.quay!.id === quayId
      },
      {
        check: 'should only include start date',
        expect:
          json.quay!.estimatedCalls.filter(call => call.date !== startDate)
            .length === 0
      }
    );
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
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
          expect: false
        }
      ]
    );
  }
}

export function quayDeparturesPOSTandGET(
  quayId: string,
  startDate: string,
  timeRange: number = 86400,
  limit: number = 1000
) {
  const requestName = 'v2_quayDeparturesPOSTandGET';
  const url = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  const resGET = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });
  const resPOST = http.post(url, '{}', {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  const expects: ExpectsType = [
    { check: 'should have status 200', expect: resGET.status === 200 },
    { check: 'should have status 200', expect: resPOST.status === 200 }
  ];

  try {
    expects.push({
      check: 'should have equal responses',
      expect:
        (resGET.json() as JSONObject).toString() ===
        (resPOST.json() as JSONObject).toString()
    });
    metrics.checkForFailures(
      [resGET.request.url],
      resGET.timings.duration + resPOST.timings.duration,
      requestName,
      expects
    );
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [resGET.request.url],
      resGET.timings.duration + resPOST.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false
        }
      ]
    );
  }
}
