import http from 'k6/http';
import {conf, ExpectsType, metrics} from '../../config/configuration';
import {bffHeadersGet, bffHeadersPost} from '../../utils/headers';
import {departsAfterExpectedStartTime} from '../../utils/utils';
import {RealtimeResponseType} from '../types';
import {DeparturesQuery} from '../../../../src/service/impl/departures/journey-gql/departures.graphql-gen';

export function realtimeScenario(quayId: string, lineId: string): void {
  // Realtime with quayId
  const searchTime = new Date();
  realtime(quayId, searchTime.toISOString());

  // Realtime outside of window (i.e. 30 min)
  const searchTimeOutsideOfWindow = new Date(searchTime.getTime() + 31 * 60000);
  realtime(quayId, searchTimeOutsideOfWindow.toISOString(), false);

  // Realtime with quayId AND corresponding lineId
  realtimeWithLineId(quayId, lineId, searchTime.toISOString());

  // Realtime with quayId AND not corresponding lineId
  realtimeWithLineId(
    quayId,
    lineId,
    searchTimeOutsideOfWindow.toISOString(),
    false,
  );
}

export function realtime(
  quayId: string,
  searchTime: string,
  hasResults: boolean = true,
  timeRange: number = 86400,
  limit: number = 10,
) {
  const requestName = 'v2_realtime';
  const url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&startTime=${searchTime}&timeRange=${timeRange}&limit=${limit}`;

  let res = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGet(),
  });

  const expects: ExpectsType = [
    {
      check: 'should have status 200',
      expect: res.status === 200,
    },
  ];

  try {
    if (hasResults) {
      const json = res.json() as RealtimeResponseType;

      // Get departure times
      const depTimes = [];
      const serviceJourneys = Object.keys(json[quayId].departures);
      for (let journey of serviceJourneys) {
        depTimes.push(
          json[quayId].departures[journey].timeData.expectedDepartureTime,
        );
      }

      expects.push(
        {
          check: 'should have correct quayId',
          expect: json[quayId].quayId === quayId,
        },
        {
          check: `should have ${limit} departures`,
          expect: Object.keys(json[quayId].departures).length === limit,
        },
        {
          check: 'should have departure times after start time',
          expect: departsAfterExpectedStartTime(depTimes, searchTime),
        },
      );
    } else {
      expects.push({
        check: 'should have empty results',
        expect: res.body === '{}',
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

export function realtimeWithLineId(
  quayId: string,
  lineId: string,
  searchTime: string,
  hasResults: boolean = true,
  limit: number = 10,
) {
  const requestName = 'v2_realtimeWithLineId';
  const lineNumber = lineId.split('_')[1];
  const url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&lineIds=${lineId}&startTime=${searchTime}&limit=${limit}`;

  let res = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGet(),
  });

  const expects: ExpectsType = [
    {
      check: 'should have status 200',
      expect: res.status === 200,
    },
  ];

  try {
    if (hasResults) {
      const json = res.json() as RealtimeResponseType;

      // Get departure times and lineIds
      const depTimes = [];
      const lineIds = [];
      const serviceJourneys = Object.keys(json[quayId].departures);
      for (let journey of serviceJourneys) {
        depTimes.push(
          json[quayId].departures[journey].timeData.expectedDepartureTime,
        );
        lineIds.push(journey.split('_')[0]);
      }

      expects.push(
        {
          check: 'should have correct quayId',
          expect: json[quayId].quayId === quayId,
        },
        {
          check: `should only have departures with lineId ${lineId}`,
          expect:
            lineIds.filter((id) => id !== `ATB:ServiceJourney:${lineNumber}`)
              .length === 0,
        },
        {
          check: 'should have departure times after start time',
          expect: departsAfterExpectedStartTime(depTimes, searchTime),
        },
      );
    } else {
      expects.push({
        check: 'should have empty results',
        expect: res.body === '{}',
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

// Check that realtime updates for a quay corresponds to quay departures
export function realtimeForQuayDepartures(quayId: string) {
  const requestName = 'v2_realtimeForQuayDepartures';
  const searchTime = new Date().toISOString();
  const urlQD = `${conf.host()}/bff/v2/departures/departures?ids=${quayId}&numberOfDepartures=10&startTime=${searchTime}&timeRange=86400`;
  const resQD = http.post(urlQD, '{}', {
    tags: {name: requestName},
    headers: bffHeadersPost(),
  });

  const expects: ExpectsType = [
    {check: 'should have status 200', expect: resQD.status === 200},
  ];

  try {
    const jsonQD = resQD.json() as DeparturesQuery;

    // Get realtime to compare
    const urlR = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&startTime=${searchTime}&limit=10`;
    const resR = http.get(urlR, {
      tags: {name: requestName},
      headers: bffHeadersGet(),
    });

    expects.push({
      check: 'should have status 200',
      expect: resR.status === 200,
    });

    // If no realtime departures, the response is "{}"
    if (resR.body !== '{}') {
      const jsonR = resR.json() as RealtimeResponseType;

      // Get departure times
      const depTimes = [];
      const serviceJourneys = Object.keys(jsonR[quayId].departures);
      for (let journey of serviceJourneys) {
        depTimes.push(
          jsonR[quayId].departures[journey].timeData.expectedDepartureTime,
        );
      }

      expects.push(
        {
          check: 'should return correct realtime departure times',
          expect: depTimes.every((time) =>
            jsonQD.quays[0].estimatedCalls
              .map((call) => call.expectedDepartureTime)
              .includes(time),
          ),
        },
        {
          check: 'should return correct service journeys',
          expect: Object.keys(jsonR[quayId].departures).every((journey) =>
            jsonQD.quays[0].estimatedCalls
              .map((call) => call.serviceJourney!.id)
              .includes(journey),
          ),
        },
      );
    }
    metrics.checkForFailures(
      [resQD.request.url, resR.request.url],
      resQD.timings.duration + resR.timings.duration,
      requestName,
      expects,
    );
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [resQD.request.url],
      resQD.timings.duration,
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
