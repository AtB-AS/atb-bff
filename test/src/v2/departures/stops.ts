import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersGet } from '../../utils/headers';
import {
  stopsDetailsTestDataType,
  stopsNearestTestDataType,
  NearestStopPlacesResponseType
} from '../types';
import { isEqual } from '../../utils/utils';
import { StopsDetailsQuery } from '../../../../src/service/impl/departures/journey-gql/stops-details.graphql-gen';

export function stopsNearest(testData: stopsNearestTestDataType) {
  for (let test of testData.scenarios) {
    const requestName = `v2_stopsNearest_${testData.scenarios.indexOf(test)}`;
    const url = `${conf.host()}/bff/v2/departures/stops-nearest?count=10&distance=${
      test.query.distance
    }&latitude=${test.query.lat}&longitude=${test.query.lon}`;

    const res = http.get(url, {
      tags: { name: requestName },
      headers: bffHeadersGet
    });
    const json = res.json() as NearestStopPlacesResponseType;

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 },
      {
        check: 'should have correct number of stop places',
        expect:
          json.nearest.edges.length === test.expectedResult.stopPlaces.length
      },
      {
        check: 'should have correct stop places',
        expect: isEqual(
          json.nearest.edges.map(edge => edge.node.place.id),
          test.expectedResult.stopPlaces
        )
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

export function stopsDetails(testData: stopsDetailsTestDataType) {
  for (let test of testData.scenarios) {
    const requestName = `v2_stopsDetails_${testData.scenarios.indexOf(test)}`;
    const url = `${conf.host()}/bff/v2/departures/stops-details?ids=${test.query.stopPlaceIds.join(
      '&ids='
    )}`;

    const res = http.get(url, {
      tags: { name: requestName },
      headers: bffHeadersGet
    });
    const json = res.json() as StopsDetailsQuery;

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    // Assert per stop place returned
    for (let expResult of test.expectedResults) {
      // Names and ids
      const resStopPlaceNames = json.stopPlaces.filter(
        stop => stop.id === expResult.stopPlaceId
      )[0].name;
      const resQuayIds = json.stopPlaces
        .filter(stop => stop.id === expResult.stopPlaceId)[0]
        .quays!.map(quay => quay.id)
        .sort();
      const expQuayIds = expResult.quays.map(e => e.id).sort();
      expects.push(
        {
          check: `stop place name should be ${expResult.stopPlaceName}`,
          expect: resStopPlaceNames === expResult.stopPlaceName
        },
        {
          check: `should have correct quays for stop place '${expResult.stopPlaceId}'`,
          expect: isEqual(resQuayIds, expQuayIds)
        }
      );
      // Public code and description
      for (let expQuay of expResult.quays) {
        if (expQuay.publicCode !== null) {
          const resQuayPC = json.stopPlaces
            .filter(stop => stop.id === expResult.stopPlaceId)[0]
            .quays!.filter(quay => quay.id === expQuay.id)[0].publicCode;
          expects.push({
            check: `public code should be '${expQuay.publicCode}' for '${expQuay.id}'`,
            expect: resQuayPC === expQuay.publicCode
          });
        }
        if (expQuay.description !== null) {
          const resQuayDesc = json.stopPlaces
            .filter(stop => stop.id === expResult.stopPlaceId)[0]
            .quays!.filter(quay => quay.id === expQuay.id)[0].description;
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
