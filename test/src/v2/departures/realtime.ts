import http from 'k6/http';
import { conf, ExpectsType, metrics } from '../../config/configuration';
import { bffHeadersGet, bffHeadersPost } from '../../utils/headers';
import {
  departsAfterExpectedStartTime,
  isEqual,
  randomNumber
} from '../../utils/utils';
import { QuayDeparturesType, RealtimeResponseType } from '../types';

export function realtimeScenario(searchDate: string): void {
  const quayId = 'NSR:Quay:73576';
  const lineId = 'ATB:Line:2_82';

  // Realtime with quayId
  let searchTime = `${searchDate}T11:00:00.${randomNumber(999, true)}Z`;
  realtime(quayId, searchTime);

  // Realtime with cache
  realtime(quayId, searchTime, false);

  // Realtime with quayId AND corresponding lineId
  searchTime = `${searchDate}T11:00:00.${randomNumber(999, true)}Z`;
  realtimeWithLineId(quayId, lineId, searchTime);

  // Realtime with quayId AND not corresponding lineId
  realtimeWithLineId(quayId, lineId, searchTime, false);
}

export function realtime(
  quayId: string,
  searchTime: string,
  hasResults: boolean = true,
  limit: number = 10
) {
  const requestName = 'v2_realtime';
  const url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&startTime=${searchTime}&limit=${limit}`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  const expects: ExpectsType = [
    {
      check: 'should have status 200',
      expect: res.status === 200
    }
  ];

  try {
    if (hasResults) {
      const json = res.json() as RealtimeResponseType;

      // Get departure times
      const depTimes = [];
      const serviceJourneys = Object.keys(json[quayId].departures);
      for (let journey of serviceJourneys) {
        depTimes.push(
          json[quayId].departures[journey].timeData.expectedDepartureTime
        );
      }

      expects.push(
        {
          check: 'should have correct quayId',
          expect: json[quayId].quayId === quayId
        },
        {
          check: `should have ${limit} departures`,
          expect: Object.keys(json[quayId].departures).length === limit
        },
        {
          check: 'should have departure times after start time',
          expect: departsAfterExpectedStartTime(depTimes, searchTime)
        }
      );
    } else {
      expects.push({
        check: 'should have empty results',
        expect: res.body === '{}'
      });
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

export function realtimeWithLineId(
  quayId: string,
  lineId: string,
  searchTime: string,
  hasResults: boolean = true,
  limit: number = 10
) {
  const requestName = 'v2_realtimeWithLineId';
  const lineNumber = lineId.split('_')[1];
  const url = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&lineIds=${lineId}&startTime=${searchTime}&limit=${limit}`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  const expects: ExpectsType = [
    {
      check: 'should have status 200',
      expect: res.status === 200
    }
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
          json[quayId].departures[journey].timeData.expectedDepartureTime
        );
        lineIds.push(journey.split('_')[0]);
      }

      expects.push(
        {
          check: 'should have correct quayId',
          expect: json[quayId].quayId === quayId
        },
        {
          check: `should only have departures with lineId ${lineId}`,
          expect:
            lineIds.filter(id => id !== `ATB:ServiceJourney:${lineNumber}`)
              .length === 0
        },
        {
          check: `should have ${limit} departures`,
          expect: Object.keys(json[quayId].departures).length === limit
        },
        {
          check: 'should have departure times after start time',
          expect: departsAfterExpectedStartTime(depTimes, searchTime)
        }
      );
    } else {
      expects.push({
        check: 'should have empty results',
        expect: res.body === '{}'
      });
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

// Check that realtime updates for a quay corresponds to quay departures
export function realtimeForQuayDepartures(quayId: string, startDate: string) {
  const requestName = 'v2_realtimeForQuayDepartures';
  let searchTime = `${startDate}T00:00:00.${randomNumber(999, true)}Z`;
  const urlQD = `${conf.host()}/bff/v2/departures/quay-departures?id=${quayId}&numberOfDepartures=10&startTime=${searchTime}&timeRange=86400`;
  const resQD = http.post(urlQD, '{}', {
    tags: { name: requestName },
    headers: bffHeadersPost
  });

  const expects: ExpectsType = [
    { check: 'should have status 200', expect: resQD.status === 200 }
  ];

  try {
    const jsonQD = resQD.json() as QuayDeparturesType;

    // Get realtime to compare
    searchTime = `${startDate}T00:00:00.${randomNumber(999, true)}Z`;
    const urlR = `${conf.host()}/bff/v2/departures/realtime?quayIds=${quayId}&startTime=${searchTime}&limit=10`;
    const resR = http.get(urlR, {
      tags: { name: requestName },
      headers: bffHeadersGet
    });
    const jsonR = resR.json() as RealtimeResponseType;
    // Get departure times
    const depTimes = [];
    const serviceJourneys = Object.keys(jsonR[quayId].departures);
    for (let journey of serviceJourneys) {
      depTimes.push(
        jsonR[quayId].departures[journey].timeData.expectedDepartureTime
      );
    }

    expects.push(
      { check: 'should have status 200', expect: resR.status === 200 },
      {
        check: 'should return correct realtime departure times',
        expect: isEqual(
          jsonQD
            .quay!.estimatedCalls.map(call => call.expectedDepartureTime)
            .sort(),
          depTimes.sort()
        )
      },
      {
        check: 'should return correct service journeys',
        expect: isEqual(
          jsonQD
            .quay!.estimatedCalls.map(call => call.serviceJourney!.id)
            .sort(),
          Object.keys(jsonR[quayId].departures).sort()
        )
      }
    );
    metrics.checkForFailures(
      [resQD.request.url, resR.request.url],
      resQD.timings.duration + resR.timings.duration,
      requestName,
      expects
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
          expect: false
        }
      ]
    );
  }
}
