import http from 'k6/http';
import { conf, metrics } from '../../config/configuration.js';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers.js';
import { timeArrayIsSorted } from '../../utils/utils.js';

export function realtime(quayIds, startDate, limit = 10) {
  const requestName = 'realtime';
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
  const requestName = 'stopDepartures';
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
  const requestName = 'stopDeparturesPOSTandGET';
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
  const requestName = 'quayDeparturesVsStopDepartures';
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
  const requestName = 'quayDepartures';
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
  const requestName = 'quayDeparturesPOSTandGET';
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
  const requestName = 'realtimeForQuayDepartures';
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
    const requestName = `stopsNearest_${testData.scenarios.indexOf(test)}`;
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
    const requestName = `stopsDetails_${testData.scenarios.indexOf(test)}`;
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

export function departureFavorites(testData, startDate, limitPerLine = 7) {
  for (let test of testData.scenarios) {
    const requestName = `departureFavorites_${testData.scenarios.indexOf(
      test
    )}`;
    let url = `${conf.host()}/bff/v2/departure-favorites?startTime=${startDate}T00:00:00.000Z&limitPerLine=${limitPerLine}`;

    let res = http.post(url, JSON.stringify(test), {
      tags: { name: requestName },
      bffHeaders: bffHeadersPost
    });

    let expStopPlaceIds = test.favorites.map(e => e.stopId).sort();
    let resStopPlaceIds = res.json(`data.#.stopPlace.id`).sort();
    let expQuayIds = test.favorites.map(e => e.quayId).sort();
    let expLineIds = test.favorites.map(e => e.lineId).sort();
    let resQuayIds = res.json(`data.#.quays.#.quay.id`).toString().split(',');

    let expects = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    //Correct stop places
    expects.push({
      check: `should have correct stop place(s)`,
      expect: resStopPlaceIds.toString() === expStopPlaceIds.toString()
    });
    // Correct quays
    for (let quayId of expQuayIds) {
      expects.push({
        check: `should include quay '${quayId}'`,
        expect: resQuayIds.includes(quayId)
      });
    }
    // Correct lineId, date on departures and number of departures - only for those requested
    for (let stopPlace of res.json('data')) {
      for (let quay of stopPlace.quays) {
        if (expQuayIds.includes(quay.quay.id)) {
          expects.push({
            check: `quay '${quay.quay.id}' should have departures`,
            expect: quay.group.length > 0
          });
          for (let line of quay.group) {
            expects.push(
              {
                check: `should have correct line from quay '${quay.quay.id}'`,
                expect: expLineIds.includes(line.lineInfo.lineId)
              },
              {
                check: `should have correct date for departures from quay '${quay.quay.id}'`,
                expect:
                  line.departures.filter(e => e.serviceDate !== startDate)
                    .length === 0
              },
              {
                check: `should have correct number of departures from quay '${quay.quay.id}'`,
                expect: line.departures.length === limitPerLine
              }
            );
          }
        } else {
          expects.push({
            check: `quay '${quay.quay.id}' should not have departures`,
            expect: quay.group.length === 0
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
  testData,
  startDate,
  limit = 7
) {
  const requestName = 'departureFavoritesVsQuayDepartures';
  // Use only 1 favorite
  let testScenario = { favorites: [testData.scenarios[0].favorites[0]] };

  let urlFav = `${conf.host()}/bff/v2/departure-favorites?startTime=${startDate}T00:00:00.000Z&limitPerLine=${limit}`;
  let resFav = http.post(urlFav, JSON.stringify(testScenario), {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  // Get departures to assert favorite results
  let urlDep = `${conf.host()}/bff/v2/departures/quay-departures?id=${
    testScenario.favorites[0].quayId
  }&numberOfDepartures=${limit}&startTime=${startDate}T00:00:00.000Z&timeRange=86400`;
  let resDep = http.post(urlDep, '{}', {
    tags: { name: requestName },
    bffHeaders: bffHeadersPost
  });

  let expects = [
    {
      check: 'should have status 200',
      expect: resFav.status === 200 && resDep.status === 200
    }
  ];

  // Assert: same service journeys and  aimed dep time as /quay-departures:
  let serviceJourneyFavorites = resFav.json(
    `data.0.quays.#(quay.id="${testScenario.favorites[0].quayId}")#.group.0.departures.#.serviceJourneyId`
  );
  let serviceJourneyDepartures = resDep.json(
    `quay.estimatedCalls.#.serviceJourney.id`
  );
  let aimedTimeFavorites = resFav.json(
    `data.0.quays.#(quay.id="${testScenario.favorites[0].quayId}")#.group.0.departures.#.aimedTime`
  );
  let aimedTimeDepartures = resDep.json(
    `quay.estimatedCalls.#.aimedDepartureTime`
  );

  expects.push(
    {
      check: 'favorite departures should have the same service journeys',
      expect:
        serviceJourneyFavorites.toString() ===
        serviceJourneyDepartures.toString()
    },
    {
      check: 'favorite departures should have the same aimed time',
      expect: aimedTimeFavorites.toString() === aimedTimeDepartures.toString()
    }
  );

  metrics.addFailureIfMultipleChecks(
    [resFav.request.url, resDep.request.url],
    resFav.timings.duration + resDep.timings.duration,
    requestName,
    expects
  );
}
