import http from "k6/http";
import { ExpectsType, conf, metrics } from "../../config/configuration";
import { bffHeadersGet, bffHeadersPost } from "../../utils/headers";
import { serviceJourneyTestDataType } from "../testData/testDataTypes";
import { JSONArray } from "k6";

export const serviceJourneyDepartures = (
  testData: serviceJourneyTestDataType,
  searchDate: string
): void => {
  let searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = `v1_serviceJourneyDepartures_${testData.scenarios.indexOf(
      test
    )}`;

    // Get service journey id
    let urlTrip = `${conf.host()}/bff/v1/journey/trip`;
    test.query.searchDate = searchTime;
    let resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost,
    });
    let serviceJourneyId = resTrip.json("@this.0.legs.0.serviceJourney.id");

    let urlSJD = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/departures?date=${searchDate}`;
    let resSJD = http.get(urlSJD, {
      tags: { name: requestName },
      headers: bffHeadersGet,
    });

    let expects: ExpectsType = [
      {
        check: "should have status 200 on /trip",
        expect: resTrip.status === 200,
      },
      {
        check: "should have status 200 on /servicejourney",
        expect: resSJD.status === 200,
      },
    ];

    // Assert
    expects.push(
      {
        check: "should have departures",
        expect: <number>resSJD.json("value.#") > 0,
      },
      {
        check: "should only have departures for the service journey",
        expect:
          (<JSONArray>resSJD.json("value.#.serviceJourney.id")).filter(
            (e) => e !== serviceJourneyId
          ).length === 0,
      }
    );

    metrics.addFailureIfMultipleChecks(
      [resTrip.request.url, resSJD.request.url],
      resTrip.timings.duration + resSJD.timings.duration,
      requestName,
      expects
    );
  }
};

export function serviceJourneyPolyline(
  testData: serviceJourneyTestDataType,
  searchDate: string
) {
  for (let test of testData.scenarios) {
    let searchTime = `${searchDate}T10:00:00.000Z`;
    const requestName = `v1_serviceJourneyPolyline_${testData.scenarios.indexOf(
      test
    )}`;

    // Get necessary parameters
    let urlTrip = `${conf.host()}/bff/v1/journey/trip`;
    test.query.searchDate = searchTime;
    let resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersGet,
    });
    let serviceJourneyId = resTrip.json("@this.0.legs.0.serviceJourney.id");
    let fromQuayId = resTrip.json("@this.0.legs.0.fromPlace.quay.id");
    let toQuayId = resTrip.json("@this.0.legs.0.toPlace.quay.id");

    // Both to and from
    let urlPoly = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/polyline?fromQuayId=${fromQuayId}&toQuayId=${toQuayId}`;
    let resPoly = http.get(urlPoly, {
      tags: { name: requestName },
      headers: bffHeadersGet,
    });
    // Only from
    let urlPoly2 = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/polyline?fromQuayId=${fromQuayId}`;
    let resPoly2 = http.get(urlPoly2, {
      tags: { name: requestName },
      headers: bffHeadersGet,
    });

    let expects: ExpectsType = [
      {
        check: "should have status 200 on /trip",
        expect: resTrip.status === 200,
      },
      {
        check: "should have status 200 on /polyline",
        expect: resPoly.status === 200 && resPoly2.status === 200,
      },
      {
        check: "should have map legs from /polyline",
        expect:
          <number>resPoly.json("mapLegs.#") > 0 &&
          <number>resPoly2.json("mapLegs.#") > 0,
      },
    ];

    metrics.addFailureIfMultipleChecks(
      [resTrip.request.url, resPoly.request.url, resPoly2.request.url],
      resTrip.timings.duration +
        resPoly.timings.duration +
        resPoly2.timings.duration,
      requestName,
      expects
    );
  }
}
