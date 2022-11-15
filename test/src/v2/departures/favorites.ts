import http from "k6/http";
import {conf, ExpectsType, metrics} from "../../config/configuration";
import { bffHeadersPost } from "../../utils/headers";
import { departureFavoritesTestDataType } from "../testData/testDataTypes";
import { JSONArray, JSONObject } from "k6";

export function departureFavorites(
  testData: departureFavoritesTestDataType,
  startDate: string,
  limitPerLine: number = 7
) {
  for (let test of testData.scenarios) {
    const requestName = `v2_departureFavorites_${testData.scenarios.indexOf(
      test
    )}`;
    let url = `${conf.host()}/bff/v2/departure-favorites?startTime=${startDate}T00:00:00.000Z&limitPerLine=${limitPerLine}`;

    let res = http.post(url, JSON.stringify(test), {
      tags: { name: requestName },
      headers: bffHeadersPost,
    });

    let expStopPlaceIds = test.favorites.map((e) => e.stopId).sort();
    let resStopPlaceIds = (<JSONArray>res.json(`data.#.stopPlace.id`)).sort();
    let expQuayIds = test.favorites.map((e) => e.quayId).sort();
    let expLineIds = test.favorites.map((e) => e.lineId).sort();
    let resQuayIds = (<JSONArray>res.json(`data.#.quays.#.quay.id`))
      .toString()
      .split(",");

    let expects: ExpectsType = [
      { check: "should have status 200", expect: res.status === 200 },
    ];

    //Correct stop places
    expects.push({
      check: `should have correct stop place(s)`,
      expect: resStopPlaceIds.toString() === expStopPlaceIds.toString(),
    });
    // Correct quays
    for (let quayId of expQuayIds) {
      expects.push({
        check: `should include quay '${quayId}'`,
        expect: resQuayIds.includes(quayId),
      });
    }
    // Correct lineId, date on departures and number of departures - only for those requested
    for (let stopPlace of <any>res.json("data")) {
      for (let quay of stopPlace.quays) {
        if (expQuayIds.includes(quay.quay.id)) {
          expects.push({
            check: `quay '${quay.quay.id}' should have departures`,
            expect: quay.group.length > 0,
          });
          for (let line of quay.group) {
            expects.push(
              {
                check: `should have correct line from quay '${quay.quay.id}'`,
                expect: expLineIds.includes(line.lineInfo.lineId),
              },
              {
                check: `should have correct date for departures from quay '${quay.quay.id}'`,
                expect:
                  (<JSONArray>line.departures).filter(
                    (e) => (<JSONObject>e).serviceDate !== startDate
                  ).length === 0,
              },
              {
                check: `should have correct number of departures from quay '${quay.quay.id}'`,
                expect: line.departures.length === limitPerLine,
              }
            );
          }
        } else {
          expects.push({
            check: `quay '${quay.quay.id}' should not have departures`,
            expect: quay.group.length === 0,
          });
        }
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

// Same departures are returned for favorite departures and 'ordinary' quay departures
export function departureFavoritesVsQuayDepartures(
  testData: departureFavoritesTestDataType,
  startDate: string,
  limit: number = 7
) {
  const requestName = "v2_departureFavoritesVsQuayDepartures";
  // Use only 1 favorite
  let testScenario = { favorites: [testData.scenarios[0].favorites[0]] };

  let urlFav = `${conf.host()}/bff/v2/departure-favorites?startTime=${startDate}T00:00:00.000Z&limitPerLine=${limit}`;
  let resFav = http.post(urlFav, JSON.stringify(testScenario), {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  // Get departures to assert favorite results
  let urlDep = `${conf.host()}/bff/v2/departures/quay-departures?id=${
    testScenario.favorites[0].quayId
  }&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;
  let resDep = http.post(urlDep, "{}", {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  let expects: ExpectsType = [
    {
      check: "should have status 200",
      expect: resFav.status === 200 && resDep.status === 200,
    },
  ];

  // Assert: same service journeys and  aimed dep time as /quay-departures:
  let serviceJourneyFavorites = <JSONArray>(
    resFav.json(
      `data.0.quays.#(quay.id="${testScenario.favorites[0].quayId}")#.group.0.departures.#.serviceJourneyId`
    )
  );
  let serviceJourneyDepartures = <JSONArray>(
    resDep.json(`quay.estimatedCalls.#.serviceJourney.id`)
  );
  let aimedTimeFavorites = <JSONArray>(
    resFav.json(
      `data.0.quays.#(quay.id="${testScenario.favorites[0].quayId}")#.group.0.departures.#.aimedTime`
    )
  );
  let aimedTimeDepartures = <JSONArray>(
    resDep.json(`quay.estimatedCalls.#.aimedDepartureTime`)
  );

  expects.push(
    {
      check: "favorite departures should have the same service journeys",
      expect:
        serviceJourneyFavorites.toString() ===
        serviceJourneyDepartures.toString(),
    },
    {
      check: "favorite departures should have the same aimed time",
      expect: aimedTimeFavorites.toString() === aimedTimeDepartures.toString(),
    }
  );

  metrics.addFailureIfMultipleChecks(
    [resFav.request.url, resDep.request.url],
    resFav.timings.duration + resDep.timings.duration,
    requestName,
    expects
  );
}
