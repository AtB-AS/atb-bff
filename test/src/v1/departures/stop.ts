import http from "k6/http";
import {conf, ExpectsType, metrics} from "../../config/configuration";
import { bffHeadersGet } from "../../utils/headers";
import { isEqual } from "../../utils/utils";
import { stopDetailsTestDataType } from "../testData/testDataTypes";
import { JSONArray } from "k6";

export function stopDetails(testData: stopDetailsTestDataType) {
  for (let test of testData.scenarios) {
    const requestName = `v1_stopDetails_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v1/stop/${test.query.stopPlace}`;

    let res = http.get(url, {
      tags: { name: requestName },
      headers: bffHeadersGet,
    });

    let expects: ExpectsType = [
      { check: "should have status 200", expect: res.status === 200 },
      {
        check: "should give correct stop place",
        expect: res.json("id") === test.expectedResult.stopPlace,
      },
      {
        check: "should have correct name",
        expect: res.json("name") === test.expectedResult.name,
      },
      {
        check: "should have correct quays",
        expect: isEqual(
          (<JSONArray>res.json("quays.#.id")).sort(),
          test.expectedResult.quays.sort()
        ),
      },
    ];

    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}

export function stopQuays(testData: stopDetailsTestDataType) {
  for (let test of testData.scenarios) {
    const requestName = `v1_stopQuays_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v1/stop/${
      test.query.stopPlace
    }/quays?filterByInUse=true`;

    let res = http.get(url, {
      tags: { name: requestName },
      headers: bffHeadersGet,
    });

    let expects: ExpectsType = [
      { check: "should have status 200", expect: res.status === 200 },
      {
        check: "should give correct stop place",
        expect:
          (<JSONArray>res.json("@this.#.stopPlace.id")).filter(
            (e) => e !== test.expectedResult.stopPlace
          ).length === 0,
      },
      {
        check: "should have correct name",
        expect:
          (<JSONArray>res.json("@this.#.stopPlace.name")).filter(
            (e) => e !== test.expectedResult.name
          ).length === 0,
      },
      {
        check: "should have correct quays",
        expect: isEqual(
          (<JSONArray>res.json("@this.#.id")).sort(),
          test.expectedResult.quays.sort()
        ),
      },
    ];

    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}
