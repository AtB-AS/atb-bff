import http from "k6/http";
import {conf, ExpectsType, metrics} from "../../config/configuration";
import { bffHeadersGet, bffHeadersPost } from "../../utils/headers";
import { timeArrayIsSorted } from "../../utils/utils";
import { JSONArray, JSONObject } from "k6";

export function realtime(
  quayIds: string,
  startDate: string,
  limit: number = 10
) {
  const requestName = "v2_realtime";
  let url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayIds}&startTime=${startDate}T11:00:00.000Z&limit=${limit}`;

  let res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet,
  });

  //NOTE: Mainly for performance, add a trend metric for the requestName. Have to be defined in 'configuration.js:reqNameList'
  //Log the request in a Trend metric
  //metrics.log(requestName, res.timings.duration);

  // Get departure times
  let depTimes = [];
  let serviceJourneys = <JSONArray>res.json(`${quayIds}.departures|@keys`);
  for (let journey of serviceJourneys) {
    depTimes.push(
      <string>(
        res.json(
          `${quayIds}.departures.${journey}.timeData.expectedDepartureTime`
        )
      )
    );
  }

  let expects: ExpectsType = [
    {
      check: "should have status 200",
      expect: res.status === 200,
    },
    {
      check: "should have correct quayId",
      expect: res.json(`${quayIds}.quayId`) === quayIds,
    },
    {
      check: "should have 10 departures",
      expect:
        (<JSONArray>res.json(`${quayIds}.departures|@keys`)).length === 10,
    },
    {
      check: "should have sorted departures",
      expect: timeArrayIsSorted(depTimes),
    },
  ];
  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}

export function stopDepartures(
  stopId: string,
  startDate: string,
  timeRange: number = 86400,
  limit: number = 10
) {
  const requestName = "v2_stopDepartures";
  let url = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let res = http.post(url, "{}", {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  let expects: ExpectsType = [
    {
      check: "should have status 200",
      expect: res.status === 200,
    },
    {
      check: "should have correct stopId",
      expect: res.json(`stopPlace.id`) === stopId,
    },
    {
      check: "should have correct number of quays",
      expect: (<JSONArray>res.json(`stopPlace.quays`)).length === 2,
    },
    {
      check: "should only include start date quay 1",
      expect:
        (<JSONArray>res.json(`stopPlace.quays.#.estimatedCalls.0.date`)).filter(
          (e) => e !== startDate
        ).length === 0,
    },
  ];
  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}

export function stopDeparturesPOSTandGET(
  stopId: string,
  startDate: string,
  timeRange = 86400,
  limit = 10
) {
  const requestName = "v2_stopDeparturesPOSTandGET";
  let url = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let resGET = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet,
  });
  let resPOST = http.post(url, "{}", {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  let expects: ExpectsType = [
    { check: "should have status 200", expect: resGET.status === 200 },
    { check: "should have status 200", expect: resPOST.status === 200 },
    {
      check: "should have equal responses",
      expect:
        (<JSONObject>resGET.json()).toString() ===
        (<JSONObject>resPOST.json()).toString(),
    },
  ];
  metrics.addFailureIfMultipleChecks(
    [resGET.request.url],
    resGET.timings.duration + resPOST.timings.duration,
    requestName,
    expects
  );
}

// Check that stop departures corresponds to the individual quay departures
export function quayDeparturesVsStopDepartures(
  stopId: string,
  startDate: string
) {
  const requestName = "v2_quayDeparturesVsStopDepartures";
  let urlSD = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;

  let resSD = http.post(urlSD, "{}", {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  // Check equality on each quay
  let quays = <JSONArray>resSD.json("stopPlace.quays.#.id");
  for (let quay of quays) {
    let urlQD = `${conf.host()}/bff/v2/departures/quay-departures?id=${quay}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;
    let resQD = http.post(urlQD, "{}", {
      tags: { name: requestName },
      headers: bffHeadersPost,
    });

    let expects: ExpectsType = [
      { check: "should have status 200", expect: resSD.status === 200 },
      { check: "should have status 200", expect: resQD.status === 200 },
      {
        check: "should return same quay departures",
        expect:
          (<JSONArray>(
            resSD.json(`stopPlace.quays.#(id="${quay}")#.estimatedCalls`)
          )).toString() ===
          (<JSONArray>resQD.json("quay.estimatedCalls")).toString(),
      },
    ];
    metrics.addFailureIfMultipleChecks(
      [resSD.request.url, resQD.request.url],
      resSD.timings.duration + resQD.timings.duration,
      `${requestName}_${quay}`,
      expects
    );
  }
}

export function quayDepartures(
  quayId: string,
  startDate: string,
  timeRange: number = 86400,
  limit: number = 1000
) {
  const requestName = "v2_quayDepartures";
  let url = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let res = http.post(url, "{}", {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  let expects: ExpectsType = [
    { check: "should have status 200", expect: res.status === 200 },
    {
      check: "should have correct quayId",
      expect: res.json(`quay.id`) === quayId,
    },
    {
      check: "should only include start date",
      expect:
        (<JSONArray>res.json(`quay.estimatedCalls.#.date`)).filter(
          (e) => e !== startDate
        ).length === 0,
    },
  ];
  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}

export function quayDeparturesPOSTandGET(
  quayId: string,
  startDate: string,
  timeRange: number = 86400,
  limit: number = 1000
) {
  const requestName = "v2_quayDeparturesPOSTandGET";
  let url = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let resGET = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet,
  });
  let resPOST = http.post(url, "{}", {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  let expects: ExpectsType = [
    { check: "should have status 200", expect: resGET.status === 200 },
    { check: "should have status 200", expect: resPOST.status === 200 },
    {
      check: "should have equal responses",
      expect:
        (<JSONObject>resGET.json()).toString() ===
        (<JSONObject>resPOST.json()).toString(),
    },
  ];
  metrics.addFailureIfMultipleChecks(
    [resGET.request.url],
    resGET.timings.duration + resPOST.timings.duration,
    requestName,
    expects
  );
}

// Check that realtime updates for a quay corresponds to quay departures
export function realtimeForQuayDepartures(quayId: string, startDate: string) {
  const requestName = "v2_realtimeForQuayDepartures";
  let urlQD = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;
  let resQD = http.post(urlQD, "{}", {
    tags: { name: requestName },
    headers: bffHeadersPost,
  });

  // Get realtime to compare
  let urlR = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&startTime=${startDate}T00:00:00.000Z&limit=10`;
  let resR = http.get(urlR, {
    tags: { name: requestName },
    headers: bffHeadersGet,
  });
  // Get departure times
  let depTimes = [];
  let serviceJourneys = <JSONArray>resR.json(`${quayId}.departures|@keys`);
  for (let journey of serviceJourneys) {
    depTimes.push(
      <string>(
        resR.json(
          `${quayId}.departures.${journey}.timeData.expectedDepartureTime`
        )
      )
    );
  }

  let expects: ExpectsType = [
    { check: "should have status 200", expect: resQD.status === 200 },
    { check: "should have status 200", expect: resR.status === 200 },
    {
      check: "should return correct realtime departure times",
      expect:
        (<JSONArray>(
          resQD.json(`quay.estimatedCalls.#.expectedDepartureTime`)
        )).toString() === depTimes.toString(),
    },
    {
      check: "should return correct service journeys",
      expect:
        (<JSONArray>(
          resQD.json(`quay.estimatedCalls.#.serviceJourney.id`)
        )).toString() ===
        (<JSONArray>resR.json(`${quayId}.departures|@keys`)).toString(),
    },
  ];
  metrics.addFailureIfMultipleChecks(
    [resQD.request.url, resR.request.url],
    resQD.timings.duration + resR.timings.duration,
    requestName,
    expects
  );
}
