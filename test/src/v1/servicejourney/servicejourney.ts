import http from 'k6/http';
import { ExpectsType, conf, metrics } from '../../config/configuration';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers';
import { serviceJourneyTestDataType } from '../../v2/types';
import { JSONArray, JSONValue } from 'k6';
import { TripsQuery } from '../../../../src/service/impl/trips/journey-gql/trip.graphql-gen';

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
    const urlTrip = `${conf.host()}/bff/v2/trips`;
    test.query.when = searchTime;
    const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });
    let serviceJourneyId = '';

    const expects: ExpectsType = [
      {
        check: 'should have status 200 on /trip',
        expect: resTrip.status === 200
      }
    ];

    try {
      const jsonTrip = resTrip.json() as TripsQuery;
      const tripNumber =
        jsonTrip.trip.tripPatterns[0].legs[0].mode === 'bus' ? 0 : 1;
      serviceJourneyId = jsonTrip.trip.tripPatterns[tripNumber].legs[0]
        .serviceJourney!.id;
    } catch (exp) {
      expects.push({
        check: `${exp}`,
        expect: false
      });
    }

    const urlSJD = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/departures?date=${searchDate}`;
    const resSJD = http.get(urlSJD, {
      tags: { name: requestName },
      headers: bffHeadersGet
    });

    try {
      // Assert
      expects.push(
        {
          check: 'should have status 200 on /servicejourney',
          expect: resSJD.status === 200
        },
        {
          check: 'should have departures',
          expect: (resSJD.json('value.#') as number) > 0
        },
        {
          check: 'should only have departures for the service journey',
          expect:
            (resSJD.json('value.#.serviceJourney.id') as JSONArray).filter(
              (e: JSONValue) => (e as string) !== serviceJourneyId
            ).length === 0
        }
      );
    } catch (exp) {
      expects.push({
        check: `${exp}`,
        expect: false
      });
    }
    metrics.checkForFailures(
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
    const searchTime = `${searchDate}T10:00:00.000Z`;
    const requestName = `v1_serviceJourneyPolyline_${testData.scenarios.indexOf(
      test
    )}`;
    let totDuration = 0;

    // Get necessary parameters
    const urlTrip = `${conf.host()}/bff/v2/trips`;
    test.query.when = searchTime;
    const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });
    totDuration += resTrip.timings.duration;

    try {
      const jsonTrip = resTrip.json() as TripsQuery;
      let serviceJourneyId = '';
      let fromQuayId = '';
      let toQuayId = '';

      // Walk through the trip patterns
      for (let trip of jsonTrip.trip.tripPatterns) {
        // Only consider direct busses
        if (trip.legs.length === 1 && trip.legs[0].mode === 'bus') {
          serviceJourneyId = trip.legs[0].serviceJourney!.id;
          fromQuayId = trip.legs[0].fromPlace.quay!.id;
          toQuayId = trip.legs[0].toPlace.quay!.id;
          break;
        }
      }

      // Both to and from
      const urlPoly = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/polyline?fromQuayId=${fromQuayId}&toQuayId=${toQuayId}`;
      const resPoly = http.get(urlPoly, {
        tags: { name: requestName },
        headers: bffHeadersGet
      });
      // Only from
      const urlPoly2 = `${conf.host()}/bff/v1/servicejourney/${serviceJourneyId}/polyline?fromQuayId=${fromQuayId}`;
      const resPoly2 = http.get(urlPoly2, {
        tags: { name: requestName },
        headers: bffHeadersGet
      });
      totDuration += resPoly.timings.duration + resPoly2.timings.duration;

      const expects: ExpectsType = [
        {
          check: 'should have status 200 on /trip',
          expect: resTrip.status === 200
        },
        {
          check: 'should have status 200 on /polyline',
          expect: resPoly.status === 200 && resPoly2.status === 200
        },
        {
          check: 'should have map legs from /polyline',
          expect:
            (resPoly.json('mapLegs.#') as number) > 0 &&
            (resPoly2.json('mapLegs.#') as number) > 0
        }
      ];

      metrics.checkForFailures(
        [resTrip.request.url, resPoly.request.url, resPoly2.request.url],
        totDuration,
        requestName,
        expects
      );
    } catch (exp) {
      metrics.checkForFailures(
        [`${conf.host()}/bff/v1/servicejourney/`],
        totDuration,
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
