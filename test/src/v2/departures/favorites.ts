import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersPost } from '../../utils/headers';
import {
  departureFavoritesTestDataType,
  FavoriteResponseType,
  QuayDeparturesType
} from '../types';
import { isEqual } from '../../utils/utils';

export function departureFavorites(
  testData: departureFavoritesTestDataType,
  startDate: string,
  limitPerLine: number = 7
) {
  for (let test of testData.scenarios) {
    const requestName = `v2_departureFavorites_${testData.scenarios.indexOf(
      test
    )}`;
    const url = `${conf.host()}/bff/v2/departure-favorites?startTime=${startDate}T00:00:00.000Z&limitPerLine=${limitPerLine}`;

    let res = http.post(url, JSON.stringify(test), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });

    try {
      const json = res.json() as FavoriteResponseType;

      const expStopPlaceIds = test.favorites.map(e => e.stopId).sort();
      const resStopPlaceIds = json.data.map(fav => fav.stopPlace.id).sort();
      const expQuayIds = test.favorites.map(e => e.quayId).sort();
      const expLineIds = test.favorites.map(e => e.lineId).sort();
      const resQuayIds = json.data
        .map(fav => fav.quays.map(quay => quay.quay.id))
        .flat();

      const expects: ExpectsType = [
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
      for (let stopPlace of json.data) {
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
                    line.departures.filter(dep => dep.serviceDate !== startDate)
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

// Same departures are returned for favorite departures and 'ordinary' quay departures
export function departureFavoritesVsQuayDepartures(
  testData: departureFavoritesTestDataType,
  startDate: string,
  limit: number = 7
) {
  const requestName = 'v2_departureFavoritesVsQuayDepartures';
  // Use only 1 favorite
  const testScenario = { favorites: [testData.scenarios[0].favorites[0]] };

  const urlFav = `${conf.host()}/bff/v2/departure-favorites?startTime=${startDate}T16:00:00.000Z&limitPerLine=${limit}`;
  const resFav = http.post(urlFav, JSON.stringify(testScenario), {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  // Get departures to assert favorite results
  const urlDep = `${conf.host()}/bff/v2/departures/quay-departures?id=${
    testScenario.favorites[0].quayId
  }&numberOfDepartures=${limit}&startTime=${startDate}T16:00:00.000Z&timeRange=86400`;
  const resDep = http.post(urlDep, '{}', {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  try {
    const jsonFav = resFav.json() as FavoriteResponseType;
    const jsonDep = resDep.json() as QuayDeparturesType;

    const expects: ExpectsType = [
      {
        check: 'should have status 200',
        expect: resFav.status === 200 && resDep.status === 200
      }
    ];

    // Assert: same service journeys and  aimed dep time as /quay-departures:
    const serviceJourneyFavorites = jsonFav.data[0].quays
      .filter(quay => quay.quay.id === testScenario.favorites[0].quayId)[0]
      .group[0].departures.map(dep => dep.serviceJourneyId);
    const serviceJourneyDepartures = jsonDep.quay.estimatedCalls.map(
      call => call.serviceJourney!.id
    );
    const aimedTimeFavorites = jsonFav.data[0].quays
      .filter(quay => quay.quay.id === testScenario.favorites[0].quayId)[0]
      .group[0].departures.map(dep => dep.aimedTime);
    const aimedTimeDepartures = jsonDep.quay.estimatedCalls.map(
      call => call.aimedDepartureTime
    );

    expects.push(
      {
        check: 'favorite departures should have the same service journeys',
        expect: isEqual(serviceJourneyFavorites, serviceJourneyDepartures)
      },
      {
        check: 'favorite departures should have the same aimed time',
        expect: isEqual(aimedTimeFavorites, aimedTimeDepartures)
      }
    );

    metrics.checkForFailures(
      [resFav.request.url, resDep.request.url],
      resFav.timings.duration + resDep.timings.duration,
      requestName,
      expects
    );
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [resFav.request.url, resDep.request.url],
      resFav.timings.duration + resDep.timings.duration,
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
