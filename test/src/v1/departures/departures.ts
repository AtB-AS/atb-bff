import http from "k6/http";
import {conf, ExpectsType, metrics} from "../../config/configuration";
import { bffHeadersGet, bffHeadersPost } from "../../utils/headers";
import { isEqual } from "../../utils/utils";
import { departuresGroupedTestDataType } from "../testData/testDataTypes";
import { JSONArray } from "k6";

export function departuresGrouped(
  testData: departuresGroupedTestDataType,
  startDate: string,
  limit: number = 5
) {
  for (let test of testData.scenarios) {
    const requestName = `v1_departuresGrouped_${testData.scenarios.indexOf(
      test
    )}`;
    let url = `${conf.host()}/bff/v1/departures-grouped?limitPerLine=${limit}&startTime=${startDate}T08:00:00.000Z`;

    let res = http.post(url, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost,
    });

    let expects: ExpectsType = [
      { check: "should have status 200", expect: res.status === 200 },
    ];

    // Assert correct stop place
    let stopPlaces = (<JSONArray>res.json("data.#.stopPlace.id")).sort();
    let stopPlacesExp = test.expectedResults.map((e) => e.stopPlace).sort();
    expects.push({
      check: "should have correct stop place",
      expect: isEqual(stopPlaces, stopPlacesExp),
    });
    // Assert correct quays
    for (let expResult of test.expectedResults) {
      let quays = (<JSONArray>(
        res.json(
          `data.#(stopPlace.id=="${expResult.stopPlace}")#.quays.#.quay.id`
        )
      )).sort();
      expects.push({
        check: `should have correct quays for stop place "${expResult.stopPlace}"`,
        expect: isEqual(quays, expResult.quays),
      });
    }

    // Assert has departures
    for (let expResult of test.expectedResults) {
      if (expResult.shouldHaveDepartures) {
        let sum = 0;
        // This json path becomes a nested array
        (<JSONArray>(
          res.json(
            `data.#(stopPlace.id=="${expResult.stopPlace}")#.quays.#.group.#.departures`
          )
        )).forEach(
          (qu) =>
            !!qu &&
            (<JSONArray>qu).forEach(
              (gr) =>
                !!gr &&
                (<JSONArray>gr).forEach(
                  (dep) => (sum += (<JSONArray>dep).length)
                )
            )
        );
        expects.push({
          check: `should have departures for stop place "${expResult.stopPlace}"`,
          expect: sum > 0,
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

export function departuresRealtime(
  quayId: string,
  startDate: string,
  limit: number = 5
) {
  const requestName = "v1_departuresRealtime";
  const startTime = startDate + "T08:00:00.000Z";
  let url = `${conf.host()}/bff/v1/departures-realtime?quayIds=${quayId}&limit=${limit}&startTime=${startTime}`;

  let res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet,
  });

  let firstExpDeparture: string = <string>(
    res.json(`${quayId}.departures.ATB*.timeData.expectedDepartureTime`)
  );
  let expects: ExpectsType = [
    { check: "should have status 200", expect: res.status === 200 },
    {
      check: "should show correct quay",
      expect: res.json(`${quayId}.quayId`) === quayId,
    },
    {
      check: "should have expected start times after requested time",
      expect: Date.parse(firstExpDeparture) > Date.parse(startTime),
    },
  ];

  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}
