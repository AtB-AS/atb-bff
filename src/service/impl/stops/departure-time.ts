import client from '../graphql-client';
import query from './departure-time.graphql';
import {
  APIError,
  DeparturesRealtimeData,
  DepartureRealtimeData,
  DepartureRealtimeQuery
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

type Variables = {
  quayIds: string[];
  startTime: Date;
  limit: number;
  timeRange: number;
};

const createVariables = (query: DepartureRealtimeQuery) => ({
  ...query,
  timeRange: 72000
});

export async function populateCacheIfNotThere(
  inputQuery: DepartureRealtimeQuery
) {
  // Trigger realtime fetch to populate cache for query
  // Reducing the amount of data for the initial realtime query.
  // Can be fire-and-forget, as it's not critical
  // if the cache is empty
  try {
    const variables = createVariables(inputQuery);
    const previousResult = getPreviousExpectedFromCache(variables);

    if (previousResult) return;

    await client.query<DepartureRealtimeDataFromGraphQL>({
      query,
      variables: createVariables(inputQuery)
    });
  } catch (e) {}
}

export async function getRealtimeDepartureTime(
  inputQuery: DepartureRealtimeQuery
): Promise<Result<DeparturesRealtimeData, APIError>> {
  try {
    const variables = createVariables(inputQuery);
    const previousResult = getPreviousExpectedFromCache(variables);
    const result = await client.query<DepartureRealtimeDataFromGraphQL>({
      query,
      variables
    });

    if (result.errors) {
      return Result.err(new APIError(result.errors));
    }

    return Result.ok(mapToDepartureRealtime(result.data, previousResult));
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

type PreviousDepartureTimeLookupService = {
  [serviceJourneyId: string]: { time: string; realtime: boolean };
};
type PreviousDepartureTimeLookup = {
  [quayId: string]: PreviousDepartureTimeLookupService;
};

function mapToDepartureRealtime(
  input: DepartureRealtimeDataFromGraphQL,
  previousResultLookup?: PreviousDepartureTimeLookup
): DeparturesRealtimeData {
  let obj: DeparturesRealtimeData = {};
  for (let quay of input.quays) {
    const departures = mapDeparture(
      quay.estimatedCalls,
      previousResultLookup?.[quay.id]
    );

    // Don't include if the result is empty. Save data and easier to see if there are updates.
    if (!Object.keys(departures).length) {
      continue;
    }

    obj[quay.id] = {
      quayId: quay.id,
      departures
    };
  }
  return obj;
}

function mapDeparture(
  input: DepartureRealtimeDataFromGraphQL['quays'][0]['estimatedCalls'],
  previousResultLookup?: PreviousDepartureTimeLookupService
) {
  let obj: DepartureRealtimeData['departures'] = {};
  for (let departure of input) {
    const serviceJourneyId = departure.serviceJourney.id;
    const previousData = previousResultLookup?.[serviceJourneyId];

    // Only include if new time is different than previous time.
    // This is to reduce unneccesary data
    if (
      previousData?.time === departure.expectedDepartureTime &&
      previousData.realtime === departure.realtime
    ) {
      continue;
    }

    obj[serviceJourneyId] = {
      serviceJourneyId,
      timeData: {
        realtime: departure.realtime,
        expectedDepartureTime: departure.expectedDepartureTime
      }
    };
  }
  return obj;
}

function getPreviousExpectedFromCache(variables: Variables) {
  try {
    const result = client.readQuery<DepartureRealtimeDataFromGraphQL>({
      query,
      variables
    });
    if (!result) {
      return undefined;
    }
    return mapToPreviousResultsHash(result);
  } catch (e) {
    // Nothing in the cache.
    return undefined;
  }
}

function mapToPreviousResultsHash(input: DepartureRealtimeDataFromGraphQL) {
  let previousExpectedDepartureTimeLookup: PreviousDepartureTimeLookup = {};
  for (let quay of input.quays) {
    const quayId = quay.id;
    previousExpectedDepartureTimeLookup[quayId] = {};
    for (let departure of quay.estimatedCalls) {
      const serviceJourneyId = departure.serviceJourney.id;
      previousExpectedDepartureTimeLookup[quayId][serviceJourneyId] = {
        time: departure.expectedDepartureTime,
        realtime: departure.realtime
      };
    }
  }
  return previousExpectedDepartureTimeLookup;
}
