import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers.js';
import { timeArrayIsSorted } from '../../utils/utils.js';

export function realtime(quayIds, startDate, limit = 10) {
  const requestName = 'v2_realtime';
  let url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayIds}&startTime=${startDate}T11:00:00.000Z&limit=${limit}`;

  let res = http.get(url, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });

  //NOTE: Mainly for performance, add a trend metric for the requestName. Have to be defined in 'configuration.js:reqNameList'
  //Log the request in a Trend metric
  //metrics.log(requestName, res.timings.duration);

  // Get departure times
  let depTimes = [];
  let serviceJourneys = res.json(`${quayIds}.departures|@keys`);
  for (let journey of serviceJourneys) {
    depTimes.push(
      res.json(
        `${quayIds}.departures.${journey}.timeData.expectedDepartureTime`
      )
    );
  }

  let expects = [
    {
      check: 'should have status 200',
      expect: res.status === 200
    },
    {
      check: 'should have correct quayId',
      expect: res.json(`${quayIds}.quayId`) === quayIds
    },
    {
      check: 'should have 10 departures',
      expect: res.json(`${quayIds}.departures|@keys`).length === 10
    },
    {
      check: 'should have sorted departures',
      expect: timeArrayIsSorted(depTimes) === true
    }
  ];
  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}

export function stopDepartures(
  stopId,
  startDate,
  timeRange = 86400,
  limit = 10
) {
  const requestName = 'v2_stopDepartures';
  let url = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let res = http.post(url, '{}', {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  let expects = [
    {
      check: 'should have status 200',
      expect: res.status === 200
    },
    {
      check: 'should have correct stopId',
      expect: res.json(`stopPlace.id`) === stopId
    },
    {
      check: 'should have correct number of quays',
      expect: res.json(`stopPlace.quays`).length === 2
    },
    {
      check: 'should only include start date quay 1',
      expect:
        res
          .json(`stopPlace.quays.#.estimatedCalls.0.date`)
          .filter(e => e !== startDate).length === 0
    }
  ];
  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}

export function stopDeparturesPOSTandGET(
  stopId,
  startDate,
  timeRange = 86400,
  limit = 10
) {
  const requestName = 'v2_stopDeparturesPOSTandGET';
  let url = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let resGET = http.get(url, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });
  let resPOST = http.post(url, '{}', {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  let expects = [
    { check: 'should have status 200', expect: resGET.status === 200 },
    { check: 'should have status 200', expect: resPOST.status === 200 },
    {
      check: 'should have equal responses',
      expect: resGET.json().toString() === resPOST.json().toString()
    }
  ];
  metrics.addFailureIfMultipleChecks(
    [resGET.request.url],
    resGET.timings.duration + resPOST.timings.duration,
    requestName,
    expects
  );
}

// Check that stop departures corresponds to the individual quay departures
export function quayDeparturesVsStopDepartures(stopId, startDate) {
  const requestName = 'v2_quayDeparturesVsStopDepartures';
  let urlSD = `${conf.host()}/bff/v2/departures/stop-departures?id=${stopId}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;

  let resSD = http.post(urlSD, '{}', {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  // Check equality on each quay
  let quays = resSD.json('stopPlace.quays.#.id');
  for (let quay of quays) {
    let urlQD = `${conf.host()}/bff/v2/departures/quay-departures?id=${quay}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;
    let resQD = http.post(urlQD, '{}', {
      tags: { name: requestName },
      bffHeaders: bffHeadersPost
    });

    let expects = [
      { check: 'should have status 200', expect: resSD.status === 200 },
      { check: 'should have status 200', expect: resQD.status === 200 },
      {
        check: 'should return same quay departures',
        expect:
          resSD
            .json(`stopPlace.quays.#(id="${quay}")#.estimatedCalls`)
            .toString() === resQD.json('quay.estimatedCalls').toString()
      }
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
  quayId,
  startDate,
  timeRange = 86400,
  limit = 1000
) {
  const requestName = 'v2_quayDepartures';
  let url = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let res = http.post(url, '{}', {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  let expects = [
    { check: 'should have status 200', expect: res.status === 200 },
    {
      check: 'should have correct quayId',
      expect: res.json(`quay.id`) === quayId
    },
    {
      check: 'should only include start date',
      expect:
        res.json(`quay.estimatedCalls.#.date`).filter(e => e !== startDate)
          .length === 0
    }
  ];
  metrics.addFailureIfMultipleChecks(
    [res.request.url],
    res.timings.duration,
    requestName,
    expects
  );
}

export function quayDeparturesPOSTandGET(
  quayId,
  startDate,
  timeRange = 86400,
  limit = 1000
) {
  const requestName = 'v2_quayDeparturesPOSTandGET';
  let url = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=${timeRange}`;

  let resGET = http.get(url, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });
  let resPOST = http.post(url, '{}', {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  let expects = [
    { check: 'should have status 200', expect: resGET.status === 200 },
    { check: 'should have status 200', expect: resPOST.status === 200 },
    {
      check: 'should have equal responses',
      expect: resGET.json().toString() === resPOST.json().toString()
    }
  ];
  metrics.addFailureIfMultipleChecks(
    [resGET.request.url],
    resGET.timings.duration + resPOST.timings.duration,
    requestName,
    expects
  );
}

// Check that realtime updates for a quay corresponds to quay departures
export function realtimeForQuayDepartures(quayId, startDate) {
  const requestName = 'v2_realtimeForQuayDepartures';
  let urlQD = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=10&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;
  let resQD = http.post(urlQD, '{}', {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  // Get realtime to compare
  let urlR = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&startTime=${startDate}T00:00:00.000Z&limit=10`;
  let resR = http.get(urlR, {
    tags: { name: requestName },
    bffHeaders: bffHeadersGet
  });
  // Get departure times
  let depTimes = [];
  let serviceJourneys = resR.json(`${quayId}.departures|@keys`);
  for (let journey of serviceJourneys) {
    depTimes.push(
      resR.json(
        `${quayId}.departures.${journey}.timeData.expectedDepartureTime`
      )
    );
  }

  let expects = [
    { check: 'should have status 200', expect: resQD.status === 200 },
    { check: 'should have status 200', expect: resR.status === 200 },
    {
      check: 'should return correct realtime departure times',
      expect:
        resQD.json(`quay.estimatedCalls.#.expectedDepartureTime`).toString() ===
        depTimes.toString()
    },
    {
      check: 'should return correct service journeys',
      expect:
        resQD.json(`quay.estimatedCalls.#.serviceJourney.id`).toString() ===
        resR.json(`${quayId}.departures|@keys`).toString()
    }
  ];
  metrics.addFailureIfMultipleChecks(
    [resQD.request.url, resR.request.url],
    resQD.timings.duration + resR.timings.duration,
    requestName,
    expects
  );
}

export function stopsNearest(testData) {
  for (let test of testData.scenarios) {
    const requestName = `v2_stopsNearest_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v2/departures/stops-nearest?count=10&distance=${
      test.query.distance
    }&latitude=${test.query.lat}&longitude=${test.query.lon}`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 },
      {
        check: 'should have correct number of stop places',
        expect:
          res.json(`nearest.edges`).length ===
          test.expectedResult.stopPlaces.length
      },
      {
        check: 'should have correct stop places',
        expect:
          res.json(`nearest.edges.#.node.place.id`).toString() ===
          test.expectedResult.stopPlaces.toString()
      }
    ];
    metrics.addFailureIfMultipleChecks(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
    );
  }
}

export function stopsDetails(testData) {
  for (let test of testData.scenarios) {
    const requestName = `v2_stopsDetails_${testData.scenarios.indexOf(test)}`;
    let url = `${conf.host()}/bff/v2/departures/stops-details?ids=${test.query.stopPlaceIds.join(
      '&ids='
    )}`;

    let res = http.get(url, {
      tags: { name: requestName },
      bffHeaders: bffHeadersGet
    });

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];
    // Assert per stop place returned
    for (let expResult of test.expectedResults) {
      // Names and ids
      let resStopPlaceNames = res
        .json(`stopPlaces.#(id="${expResult.stopPlaceId}")#.name`)
        .toString();
      let resQuayIds = res
        .json(`stopPlaces.#(id="${expResult.stopPlaceId}")#.quays.#.id`)[0]
        .sort()
        .toString();
      let expQuayIds = expResult.quays
        .map(e => e.id)
        .sort()
        .toString();
      expects.push(
        {
          check: `stop place name should be ${expResult.stopPlaceName}`,
          expect: resStopPlaceNames === expResult.stopPlaceName
        },
        {
          check: `should have correct quays for stop place '${expResult.stopPlaceId}'`,
          expect: resQuayIds === expQuayIds
        }
      );

      // Public code and description
      for (let expQuay of expResult.quays) {
        if (expQuay.publicCode !== null) {
          let resQuayPC = res
            .json(
              `stopPlaces.#(id="${expResult.stopPlaceId}")#.quays.#(id="${expQuay.id}")#.publicCode`
            )
            .toString();
          expects.push({
            check: `public code should be '${expQuay.publicCode}' for '${expQuay.id}'`,
            expect: resQuayPC === expQuay.publicCode
          });
        }
        if (expQuay.description !== null) {
          let resQuayDesc = res
            .json(
              `stopPlaces.#(id="${expResult.stopPlaceId}")#.quays.#(id="${expQuay.id}")#.description`
            )
            .toString();
          expects.push({
            check: `description should be '${expQuay.description}' for '${expQuay.id}'`,
            expect: resQuayDesc === expQuay.description
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
