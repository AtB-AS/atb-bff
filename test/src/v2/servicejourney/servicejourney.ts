import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers';
import { isEqual, useNoDecimals } from '../../utils/utils';
import {
  serviceJourneyTestDataType,
  PolylineSimplifiedResponseType,
  ServiceJourneyDeparturesResponseType
} from '../types';
import { TripsQuery } from '../../../../src/service/impl/trips/journey-gql/trip.graphql-gen';
import { ServiceJourneyCallsResponseType } from '../types/servicejourney';

export function serviceJourneyDepartures(
  testData: serviceJourneyTestDataType,
  searchDate: string
) {
  const searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = `v2_serviceJourneyDepartures_${testData.scenarios.indexOf(
      test
    )}`;

    // Get service journey id
    const urlTrip = `${conf.host()}/bff/v2/trips`;
    test.query.when = searchTime;
    const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });

    try {
      const jsonTrip = resTrip.json() as TripsQuery;
      const tripNumber =
        jsonTrip.trip.tripPatterns[0].legs[0].mode === 'bus' ? 0 : 1;
      const serviceJourneyId = jsonTrip.trip.tripPatterns[tripNumber].legs[0]
        .serviceJourney!.id;

      const urlSJD = `${conf.host()}/bff/v2/servicejourney/${serviceJourneyId}/departures?date=${searchDate}`;
      const resSJD = http.get(urlSJD, {
        tags: { name: requestName },
        headers: bffHeadersGet
      });
      const jsonSJD = resSJD.json() as ServiceJourneyDeparturesResponseType;

      const expects: ExpectsType = [
        {
          check: 'should have status 200 on /trip',
          expect: resTrip.status === 200
        },
        {
          check: 'should have status 200 on /servicejourney',
          expect: resSJD.status === 200
        }
      ];

      if (resSJD.status === 200) {
        // Assert service journey id
        expects.push(
          {
            check: 'should have departures',
            expect: jsonSJD.value.length > 0
          },
          {
            check: 'should only have departures for the service journey',
            expect:
              jsonSJD.value
                .map(dep => dep.serviceJourney!.id)
                .filter(id => id !== serviceJourneyId).length === 0
          }
        );
        // Assert expected start time from travel search
        const expStartTime =
          jsonTrip.trip.tripPatterns[tripNumber].legs[0].expectedStartTime;
        expects.push({
          check: 'should have correct expected start time',
          expect: jsonSJD.value
            .map(dep => dep.expectedDepartureTime)
            .includes(expStartTime)
        });
      }

      metrics.checkForFailures(
        [resTrip.request.url, resSJD.request.url],
        resTrip.timings.duration + resSJD.timings.duration,
        requestName,
        expects
      );
    } catch (exp) {
      metrics.checkForFailures(
        [resTrip.request.url],
        resTrip.timings.duration,
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

// New structured request for 'serviceJourneyDepartures'
export function serviceJourneyCalls(
  testData: serviceJourneyTestDataType,
  searchDate: string
) {
  const searchTime = `${searchDate}T10:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = `v2_serviceJourneyCalls_${testData.scenarios.indexOf(
      test
    )}`;

    // Get service journey id
    const urlTrip = `${conf.host()}/bff/v2/trips`;
    test.query.when = searchTime;
    const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });

    try {
      const jsonTrip = resTrip.json() as TripsQuery;
      const tripNumber =
        jsonTrip.trip.tripPatterns[0].legs[0].mode === 'bus' ? 0 : 1;
      const serviceJourneyId = jsonTrip.trip.tripPatterns[tripNumber].legs[0]
        .serviceJourney!.id;
      const lineId = serviceJourneyId.split(':')[2].split('_')[0];

      const urlSJC = `${conf.host()}/bff/v2/servicejourney/${serviceJourneyId}/calls?date=${searchDate}`;
      const resSJC = http.get(urlSJC, {
        tags: { name: requestName },
        headers: bffHeadersGet
      });
      const jsonSJC = resSJC.json() as ServiceJourneyCallsResponseType;

      const expects: ExpectsType = [
        {
          check: 'should have status 200 on /trip',
          expect: resTrip.status === 200
        },
        {
          check: 'should have status 200 on /servicejourney',
          expect: resSJC.status === 200
        }
      ];

      if (resSJC.status === 200) {
        // Assert service journey id and line id
        expects.push(
          {
            check: 'should have departures',
            expect: jsonSJC.value.estimatedCalls.length > 0
          },
          {
            check: 'should return correct service journey',
            expect: jsonSJC.value.id === serviceJourneyId
          },
          {
            check: 'should have correct line id',
            expect: jsonSJC.value.line.publicCode === lineId
          }
        );
        // Assert situations only on estimated call level
        expects.push(
          {
            check: 'should not have situations on top level',
            expect: resSJC.json('value.situations') === undefined
          },
          {
            check: 'should have situations on estimated call',
            expect:
              jsonSJC.value.estimatedCalls.map(call => call.situations)
                .length >= 0
          }
        );
        // Assert expected start time from travel search
        const expStartTime =
          jsonTrip.trip.tripPatterns[tripNumber].legs[0].expectedStartTime;
        expects.push({
          check: 'should have correct expected start time',
          expect: jsonSJC.value.estimatedCalls
            .map(call => call.expectedDepartureTime)
            .includes(expStartTime)
        });
      }

      metrics.checkForFailures(
        [resTrip.request.url, resSJC.request.url],
        resTrip.timings.duration + resSJC.timings.duration,
        requestName,
        expects
      );
    } catch (exp) {
      metrics.checkForFailures(
        [resTrip.request.url],
        resTrip.timings.duration,
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

// Polyline for a service journey
// Testdata is from start to end
export function polyline(
  testData: serviceJourneyTestDataType,
  searchDate: string
) {
  let startTime = `${searchDate}T08:00:00.000Z`;
  for (let test of testData.scenarios) {
    const requestName = 'v2_polyline';
    const urlTrip = `${conf.host()}/bff/v2/trips`;
    // Update the search time
    test.query.when = startTime;

    const resTrip = http.post(urlTrip, JSON.stringify(test.query), {
      tags: { name: requestName },
      headers: bffHeadersPost
    });

    try {
      const jsonTrip = resTrip.json() as TripsQuery;

      const expects: ExpectsType = [
        {
          check: 'should have status 200 on /trip',
          expect: resTrip.status === 200
        }
      ];

      const urlList = [urlTrip];
      let polylineDuration = 0.0;
      // Walk through the trip patterns
      for (let trip of jsonTrip.trip.tripPatterns) {
        // Only consider direct busses
        if (trip.legs.length === 1 && trip.legs[0].mode === 'bus') {
          const fromCoords = [
            useNoDecimals(trip.legs[0].fromPlace.latitude, 2),
            useNoDecimals(trip.legs[0].fromPlace.longitude, 2)
          ];
          const toCoords = [
            useNoDecimals(trip.legs[0].toPlace.latitude, 2),
            useNoDecimals(trip.legs[0].toPlace.longitude, 2)
          ];
          const serviceJourney = trip.legs[0].serviceJourney!.id;
          const fromQuay = trip.legs[0].fromPlace.quay!.id;
          const toQuay = trip.legs[0].toPlace.quay!.id;

          // Only from
          const urlPolyline = `${conf.host()}/bff/v2/servicejourney/${serviceJourney}/polyline?fromQuayId=${fromQuay}`;
          // Both from and to
          const urlPolyline2 = `${conf.host()}/bff/v2/servicejourney/${serviceJourney}/polyline?fromQuayId=${fromQuay}&toQuayId=${toQuay}`;
          urlList.push(urlPolyline, urlPolyline2);

          const resPolyline = http.get(urlPolyline, {
            tags: { name: requestName },
            headers: bffHeadersGet
          });
          polylineDuration += resPolyline.timings.duration;
          const jsonPoly = resPolyline.json() as PolylineSimplifiedResponseType;
          const resPolyline2 = http.get(urlPolyline2, {
            tags: { name: requestName },
            headers: bffHeadersGet
          });
          polylineDuration += resPolyline2.timings.duration;
          const jsonPoly2 = resPolyline2.json() as PolylineSimplifiedResponseType;

          const startCoordsPolyline = [
            useNoDecimals(jsonPoly.start.latitude, 2),
            useNoDecimals(jsonPoly.start.longitude, 2)
          ];
          const stopCoordsPolyline = [
            useNoDecimals(jsonPoly.stop.latitude, 2),
            useNoDecimals(jsonPoly.stop.longitude, 2)
          ];
          const startCoordsPolyline2 = [
            useNoDecimals(jsonPoly2.start.latitude, 2),
            useNoDecimals(jsonPoly2.start.longitude, 2)
          ];
          const stopCoordsPolyline2 = [
            useNoDecimals(jsonPoly2.stop.latitude, 2),
            useNoDecimals(jsonPoly2.stop.longitude, 2)
          ];

          expects.push(
            {
              check: 'should have status 200 on /polyline',
              expect: resPolyline.status === 200 && resPolyline2.status === 200
            },
            {
              check: 'should have correct start coordinates with from',
              expect: isEqual(fromCoords, startCoordsPolyline)
            },
            {
              check: 'should have correct start coordinates with from and to',
              expect: isEqual(fromCoords, startCoordsPolyline2)
            },
            {
              check: 'should have correct stop coordinates with from',
              expect: isEqual(toCoords, stopCoordsPolyline)
            },
            {
              check: 'should have correct stop coordinates with from and to',
              expect: isEqual(toCoords, stopCoordsPolyline2)
            }
          );
        }
      }
      metrics.checkForFailures(
        urlList,
        resTrip.timings.duration + polylineDuration,
        requestName,
        expects
      );
    } catch (exp) {
      metrics.checkForFailures(
        [resTrip.request.url],
        resTrip.timings.duration,
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
