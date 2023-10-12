import {conf, ExpectsType, metrics} from '../../config/configuration';
import http from 'k6/http';
import {bffHeadersGet, bffHeadersPost} from '../../utils/headers';
import {DeparturesQuery} from '../../../../src/service/impl/departures/journey-gql/departures.graphql-gen';
import {GetServiceJourneyVehicleQuery} from '../../../../src/service/impl/vehicles/vehicles-gql/vehicles.graphql-gen';
import {getCurrentTime} from '../../utils/utils';

export function serviceJourneys() {
  const requestName = `v2_serviceJourneys`;
  const currentTime = getCurrentTime();

  // Get a service journey id
  const urlDep = `${conf.host()}/bff/v2/departures/departures?ids=NSR:Quay:71184&numberOfDepartures=1&startTime=${currentTime}&timeRange=86400`;

  const resDep = http.post(urlDep, '{}', {
    tags: {name: requestName},
    headers: bffHeadersPost,
  });
  let resSJUrl = '';
  let resSJTimimg = 0;

  const expects: ExpectsType = [
    {
      check: 'should have status 200 on /departures',
      expect: resDep.status === 200,
    },
  ];

  try {
    const jsonDep = resDep.json() as DeparturesQuery;
    const serviceJourneyId =
      jsonDep.quays[0].estimatedCalls[0].serviceJourney.id;
    const url = `${conf.host()}/bff/v2/vehicles/service-journeys?serviceJourneyIds=${serviceJourneyId}`;

    const res = http.get(url, {
      tags: {name: requestName},
      headers: bffHeadersGet,
    });
    resSJUrl = res.request.url;
    resSJTimimg = res.timings.duration;

    const jsonSJ = res.json() as GetServiceJourneyVehicleQuery['vehicles'];

    if (jsonSJ !== undefined) {
      expects.push(
        {
          check: 'should have status 200 on /service-journeys',
          expect: res.status === 200,
        },
        {
          check: 'should have a location',
          expect:
            jsonSJ[0].location!.latitude > 0.0 &&
            jsonSJ[0].location!.longitude > 0.0,
        },
        {
          check: 'should have a bearing',
          expect: jsonSJ[0].bearing! > 0,
        },
        {
          check: 'should have correct service journey id',
          expect: jsonSJ[0].serviceJourney!.id === serviceJourneyId,
        },
      );
    } else {
      expects.push({
        check: 'should have a response on /service-journeys',
        expect: false,
      });
    }

    metrics.checkForFailures(
      [resDep.request.url, res.request.url],
      resDep.timings.duration + res.timings.duration,
      requestName,
      expects,
    );
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [resDep.request.url, resSJUrl],
      resDep.timings.duration + resSJTimimg,
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
