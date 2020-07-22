import client from '../graphql-client';
import query from './departure-time.graphql';
import {
  APIError,
  DeparturesRealtimeData,
  DepartureRealtimeData
} from '../../types';
import { Result } from '@badrap/result';

type DepartureRealtimeDataFromGraphQL = {
  quays: Array<{
    id: string;
    estimatedCalls: Array<{
      realtime: boolean;
      serviceJourney: {
        line: {
          id: string;
        };
        id: string;
      };
      expectedArrivalTime: string;
      expectedDepartureTime: string;
      actualArrivalTime: string;
      actualDepartureTime: string;
      aimedArrivalTime: string;
      aimedDepartureTime: string;
    }>;
  }>;
};

export async function getRealtimeDepartureTime(
  quayIds: string[],
  lineIds: string[]
): Promise<Result<DeparturesRealtimeData, APIError>> {
  const variables = {
    quayIds,
    lineIds,
    timeRange: 72000,
    numPerLine: 5
  };

  const result = await client.query<DepartureRealtimeDataFromGraphQL>({
    query,
    variables
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  try {
    return Result.ok(mapToDepartureRealtime(result.data));
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

function mapToDepartureRealtime(
  input: DepartureRealtimeDataFromGraphQL
): DeparturesRealtimeData {
  let obj: DeparturesRealtimeData = {};
  for (let quay of input.quays) {
    obj[quay.id] = {
      quayId: quay.id,
      departures: mapDeparture(quay.estimatedCalls)
    };
  }
  return obj;
}

function mapDeparture(
  input: DepartureRealtimeDataFromGraphQL['quays'][0]['estimatedCalls']
) {
  let obj: DepartureRealtimeData['departures'] = {};
  for (let departure of input) {
    obj[departure.serviceJourney.id] = {
      ...departure,
      serviceJourneyId: departure.serviceJourney.id,
      timeData: {
        realtime: departure.realtime,
        expectedArrivalTime: departure.expectedArrivalTime,
        expectedDepartureTime: departure.expectedDepartureTime,
        actualArrivalTime: departure.actualArrivalTime,
        actualDepartureTime: departure.actualDepartureTime,
        aimedArrivalTime: departure.aimedArrivalTime,
        aimedDepartureTime: departure.aimedDepartureTime
      }
    };
  }
  return obj;
}
