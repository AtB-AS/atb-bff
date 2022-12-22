import { Result } from '@badrap/result';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
import {
  APIError,
  DepartureRealtimeData,
  DepartureRealtimeQuery,
  DeparturesRealtimeData
} from '../../types';
import {
  EstimatedCallFragment,
  GetDepartureRealtimeDocument,
  GetDepartureRealtimeQuery,
  GetDepartureRealtimeQueryVariables
} from '../departure-favorites/journey-gql/jp3/departure-time.graphql-gen';

const createVariables = (
  query: DepartureRealtimeQuery
): GetDepartureRealtimeQueryVariables => ({
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

    await journeyPlannerClient_v3.query<
      GetDepartureRealtimeQuery,
      GetDepartureRealtimeQueryVariables
    >({
      query: GetDepartureRealtimeDocument,
      variables: createVariables(inputQuery),
      fetchPolicy: 'cache-first'
    });
  } catch (e) {}
}

export async function getRealtimeDepartureTime(
  inputQuery: DepartureRealtimeQuery
): Promise<Result<DeparturesRealtimeData, APIError>> {
  try {
    const variables = createVariables(inputQuery);
    const previousResult = getPreviousExpectedFromCache(variables);
    const result = await journeyPlannerClient_v3.query<
      GetDepartureRealtimeQuery,
      GetDepartureRealtimeQueryVariables
    >({
      query: GetDepartureRealtimeDocument,
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
  input: GetDepartureRealtimeQuery,
  previousResultLookup?: PreviousDepartureTimeLookup
): DeparturesRealtimeData {
  let obj: DeparturesRealtimeData = {};
  for (let quay of input.quays) {
    if (!quay) continue;
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
  input: EstimatedCallFragment[],
  previousResultLookup?: PreviousDepartureTimeLookupService
) {
  let obj: DepartureRealtimeData['departures'] = {};
  for (let departure of input) {
    const serviceJourneyId = departure.serviceJourney!.id;
    const previousData = previousResultLookup?.[serviceJourneyId];

    // Only include if new time is different than previous time.
    // This is to reduce unneccesary data
    if (
      previousData?.time === departure.expectedDepartureTime &&
      previousData?.realtime === departure.realtime
    ) {
      continue;
    }

    obj[serviceJourneyId] = {
      serviceJourneyId,
      timeData: {
        realtime: departure.realtime ?? false,
        expectedDepartureTime: departure.expectedDepartureTime
      }
    };
  }
  return obj;
}

function getPreviousExpectedFromCache(
  variables: GetDepartureRealtimeQueryVariables
) {
  try {
    const result = journeyPlannerClient_v3.readQuery<
      GetDepartureRealtimeQuery,
      GetDepartureRealtimeQueryVariables
    >({
      query: GetDepartureRealtimeDocument,
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

function mapToPreviousResultsHash(input: GetDepartureRealtimeQuery) {
  let previousExpectedDepartureTimeLookup: PreviousDepartureTimeLookup = {};
  for (let quay of input.quays) {
    const quayId = quay.id;
    previousExpectedDepartureTimeLookup[quayId] = {};
    for (let departure of quay.estimatedCalls) {
      const serviceJourneyId = departure.serviceJourney!.id;
      previousExpectedDepartureTimeLookup[quayId][serviceJourneyId] = {
        time: departure.expectedDepartureTime,
        realtime: departure.realtime ?? false
      };
    }
  }
  return previousExpectedDepartureTimeLookup;
}
