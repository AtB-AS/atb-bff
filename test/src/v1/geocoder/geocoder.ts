import http from 'k6/http';
import {conf, ExpectsType, metrics} from '../../config/configuration';
import {bffHeadersGet} from '../../utils/headers';
import {
  GeocoderFeatureResponseType,
  GeocoderReverseResponseType,
  geocoderTestDataType,
} from '../types';

export function geocoderFeatures(
  testData: geocoderTestDataType,
  limit: number = 10,
) {
  for (let test of testData.scenarios) {
    const requestName = `v1_geocoderFeatures_${testData.scenarios.indexOf(
      test,
    )}`;
    const latitude = test.query.latitude;
    const longitude = test.query.longitude;
    const searchString = encodeURI(test.query.searchString as string);
    const url = `${conf.host()}/bff/v1/geocoder/features?lat=${latitude}&limit=${limit}&lon=${longitude}&query=${searchString}`;

    const res = http.get(url, {
      tags: {name: requestName},
      headers: bffHeadersGet,
    });

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];

    try {
      const json = res.json() as GeocoderFeatureResponseType;

      // Asserts
      for (let expResult of test.expectedResults) {
        expects.push(
          {
            check: `should include "${expResult.id}"`,
            expect: json
              .map((feature) => feature.properties.id)
              .includes(expResult.id),
          },
          {
            check: `should have correct name for "${expResult.id}"`,
            expect:
              json.filter(
                (feature) => feature.properties.id === expResult.id,
              )[0].properties.name === expResult.name,
          },
          {
            check: `should include category "${expResult.category}" for "${expResult.id}"`,
            expect: json
              .filter((feature) => feature.properties.id === expResult.id)[0]
              .properties.category.flat()
              .includes(expResult.category),
          },
        );
      }

      // Assert if more hits
      if (test.moreResults) {
        expects.push({
          check: `should have more hits than ${test.expectedResults.length}`,
          expect: json.length > test.expectedResults.length,
        });
      }

      metrics.checkForFailures(
        [res.request.url],
        res.timings.duration,
        requestName,
        expects,
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
            expect: false,
          },
        ],
      );
    }
  }
}

export function geocoderReverse(testData: geocoderTestDataType) {
  for (let test of testData.scenarios) {
    const requestName = `v1_geocoderReverse_${testData.scenarios.indexOf(
      test,
    )}`;
    const latitude = test.query.latitude;
    const longitude = test.query.longitude;
    const url = `${conf.host()}/bff/v1/geocoder/reverse?lat=${latitude}&lon=${longitude}`;

    const res = http.get(url, {
      tags: {name: requestName},
      headers: bffHeadersGet,
    });

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];

    try {
      const json = res.json() as GeocoderReverseResponseType;

      // Asserts
      for (let expResult of test.expectedResults) {
        expects.push(
          {
            check: `should include "${expResult.id}"`,
            expect: json
              .map((feature) => feature.properties.id)
              .includes(expResult.id),
          },
          {
            check: `should have correct name for "${expResult.id}"`,
            expect:
              json.filter(
                (feature) => feature.properties.id === expResult.id,
              )[0].properties.name === expResult.name,
          },
          {
            check: `should include category "${expResult.category}" for "${expResult.id}"`,
            expect: json
              .filter((feature) => feature.properties.id === expResult.id)[0]
              .properties.category.flat()
              .includes(expResult.category),
          },
        );
      }

      // Assert if more hits
      if (test.moreResults) {
        expects.push({
          check: `should have more hits than ${test.expectedResults.length}`,
          expect: json.length > test.expectedResults.length,
        });
      }

      metrics.checkForFailures(
        [res.request.url],
        res.timings.duration,
        requestName,
        expects,
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
            expect: false,
          },
        ],
      );
    }
  }
}
