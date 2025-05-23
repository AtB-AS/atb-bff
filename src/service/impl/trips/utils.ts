import {TripsQueryVariables} from './journey-gql/trip.graphql-gen';
import {
  TripPattern as TripPattern_v3,
  TripsQueryWithJourneyIds,
} from '../../../types/trips';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import {addSeconds, parseISO, formatDate} from 'date-fns';

const START_TIME_PADDING = 60; // time in seconds

/**
 * Creates a unique query to fetch updates to a single Trip
 * The query should always be a departure search with start time just before the aimed start time from the first leg
 * We also supply the serviceJourneyIds so we can match the exact trip form the search results.
 * JourneyPlanner v3
 * @param trip
 * @param queryVariables
 */
export function generateSingleTripQueryString(
  trip: TripPattern_v3,
  queryVariables: TripsQueryVariables,
) {
  // extract journeyIds for all legs
  const journeyIds = extractServiceJourneyIds(trip);

  // sanitize query, and set search time.
  const when = getPaddedStartTime(trip.legs[0].aimedStartTime);
  const {
    from,
    to,
    transferPenalty,
    waitReluctance,
    walkReluctance,
    walkSpeed,
    modes,
  } = queryVariables;
  const arriveBy = false;
  const singleTripQuery: TripsQueryVariables = {
    when,
    from,
    to,
    transferPenalty,
    waitReluctance,
    walkReluctance,
    walkSpeed,
    arriveBy,
    modes,
  };

  // encode to string
  return compressToEncodedURIComponent(
    JSON.stringify({query: singleTripQuery, journeyIds}),
  );
}

function getPaddedStartTime(time: string): string {
  const startTime = parseISO(time);
  return addSeconds(startTime, -START_TIME_PADDING).toISOString();
}

export function toMidnight(time: string): string {
  const date = formatDate(parseISO(time), 'yyyy-MM-dd');
  return `${date}T00:00:00.000Z`;
}

/**
 * Maps a TripQueryString into QueryVariables and journeyIds
 * JourneyPlanner v3
 * @param compressedQueryString
 */
export function parseTripQueryString(
  compressedQueryString: string,
): TripsQueryWithJourneyIds {
  const queryString = decompressFromEncodedURIComponent(compressedQueryString);
  if (!queryString) {
    throw new Error();
  }
  const queryFields = JSON.parse(queryString);
  return {
    query: queryFields.query,
    journeyIds: queryFields.journeyIds,
  };
}

/**
 * Extracts an array of ServiceJourney IDs from a TripPattern.
 * used as an attempt to identify a single Trip
 * Journeyplanner v3
 * @param trip
 */
export function extractServiceJourneyIds(trip: TripPattern_v3) {
  return trip.legs
    .map((leg) => {
      return leg.serviceJourney?.id ?? null;
    })
    .filter((jId) => {
      return !!jId;
    });
}
