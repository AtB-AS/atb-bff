import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers';
import { isEqual } from '../../utils/utils';
import { departuresGroupedTestDataType } from '../types';
import { JSONArray, JSONValue } from 'k6';

export function departuresGrouped(
  testData: departuresGroupedTestDataType,
  startDate: string,
  limit: number = 5
) {
  for (let test of testData.scenarios) {
    const requestName = `v1_departuresGrouped_${testData.scenarios.indexOf(
      test
    )}`;
    const url = `${conf.host()}/bff/v1/departures-grouped?limitPerLine=${limit}&startTime=${startDate}T08:00:00.000Z`;

    const res = http.post(url, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    try {
      // Assert correct stop place
      const stopPlaces = (res.json('data.#.stopPlace.id') as JSONArray).sort();
      const stopPlacesExp = test.expectedResults.map(e => e.stopPlace).sort();
      expects.push({
        check: 'should have correct stop place',
        expect: isEqual(stopPlaces, stopPlacesExp)
      });
      // Assert correct quays
      for (let expResult of test.expectedResults) {
        const quays = (res.json(
          `data.#(stopPlace.id=="${expResult.stopPlace}")#.quays.#.quay.id`
        ) as JSONArray).sort();
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
          (res.json(
            `data.#(stopPlace.id=="${expResult.stopPlace}")#.quays.#.group.#.departures`
          ) as JSONArray).forEach(
            (stopPlace: JSONValue) =>
              !!stopPlace &&
              (stopPlace as JSONArray).forEach(
                (quay: JSONValue) =>
                  !!quay &&
                  (quay as JSONArray).forEach(
                    (dep: JSONValue) => (sum += (dep as JSONArray).length)
                  )
              )
          );
          expects.push({
            check: `should have departures for stop place "${expResult.stopPlace}"`,
            expect: sum > 0
          });
        }
      }

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
}

export function departuresRealtime(
  quayId: string,
  startDate: string,
  limit: number = 5
) {
  const requestName = 'v1_departuresRealtime';
  const startTime = startDate + 'T08:00:00.000Z';
  const url = `${conf.host()}/bff/v1/departures-realtime?quayIds=${quayId}&limit=${limit}&startTime=${startTime}`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  const expects: ExpectsType = [
    { check: 'should have status 200', expect: res.status === 200 }
  ];

  try {
    const firstExpDeparture = res.json(
      `${quayId}.departures.ATB*.timeData.expectedDepartureTime`
    ) as string;
    expects.push(
      {
        check: 'should show correct quay',
        expect: res.json(`${quayId}.quayId`) === quayId
      },
      {
        check: 'should have expected start times after requested time',
        expect: Date.parse(firstExpDeparture) > Date.parse(startTime)
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
