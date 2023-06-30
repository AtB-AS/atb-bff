import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {
  DepartureRealtimeData,
  DepartureRealtimeQuery,
  DeparturesRealtimeData,
} from '../../types';
import {
  EstimatedCallFragment,
  GetDepartureRealtimeDocument,
  GetDepartureRealtimeQuery,
  GetDepartureRealtimeQueryVariables,
} from './journey-gql/departure-time.graphql-gen';
import {ReqRefDefaults, Request} from '@hapi/hapi';

export const createVariables = (
  query: DepartureRealtimeQuery,
): GetDepartureRealtimeQueryVariables => ({
  ...query,
  timeRange: query.timeRange ?? 86400,
});

/**
 * Trigger realtime fetch to populate cache for the query, reducing the amount
 * of data for the initial realtime query. Can be fire-and-forget, as it's not
 * critical if the cache is empty.
 *
 * To get a cache hit, `inputQuery` needs to match the query for the subsequent
 * realtime request.
 */
export async function populateRealtimeCacheIfNotThere(
  inputQuery: DepartureRealtimeQuery,
  headers: Request<ReqRefDefaults>,
) {
  try {
    const variables = createVariables(inputQuery);
    const previousResult = getPreviousExpectedFromCache(variables, headers);

    if (previousResult) return;

    await journeyPlannerClient(headers).query<
      GetDepartureRealtimeQuery,
      GetDepartureRealtimeQueryVariables
    >({
      query: GetDepartureRealtimeDocument,
      variables,
      // With fetch policy set to `cache-first`, apollo client will return data
      // from the cache, or fetch new data and populate the cache.
      fetchPolicy: 'cache-first',
    });
  } catch (e) {}
}

type PreviousDepartureTimeLookupService = {
  [serviceJourneyId: string]: {time: string; realtime: boolean};
};
type PreviousDepartureTimeLookup = {
  [quayId: string]: PreviousDepartureTimeLookupService;
};

export function mapToDepartureRealtime(
  input: GetDepartureRealtimeQuery,
  previousResultLookup?: PreviousDepartureTimeLookup,
): DeparturesRealtimeData {
  let obj: DeparturesRealtimeData = {};
  for (let quay of input.quays) {
    if (!quay) continue;
    const departures = mapDeparture(
      quay.estimatedCalls,
      previousResultLookup?.[quay.id],
    );

    // Don't include if the result is empty. Save data and easier to see if there are updates.
    if (!Object.keys(departures).length) {
      continue;
    }

    obj[quay.id] = {
      quayId: quay.id,
      departures,
    };
  }
  return obj;
}

function mapDeparture(
  input: EstimatedCallFragment[],
  previousResultLookup?: PreviousDepartureTimeLookupService,
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
        expectedDepartureTime: departure.expectedDepartureTime,
        aimedDepartureTime: departure.aimedDepartureTime,
      },
    };
  }
  return obj;
}

export function getPreviousExpectedFromCache(
  variables: GetDepartureRealtimeQueryVariables,
  headers: Request<ReqRefDefaults>,
) {
  try {
    const result = journeyPlannerClient(headers).readQuery<
      GetDepartureRealtimeQuery,
      GetDepartureRealtimeQueryVariables
    >({
      query: GetDepartureRealtimeDocument,
      variables,
    });
    if (!result) return undefined;

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
        realtime: departure.realtime ?? false,
      };
    }
  }
  return previousExpectedDepartureTimeLookup;
}
