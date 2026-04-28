import {TripsQueryVariables} from './journey-gql/trip.graphql-gen';
import {
  TripPattern as TripPattern_v3,
  TripsQueryWithJourneyIds,
  Leg,
  TripPatternStatus,
} from '../../../types/trips';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import {addSeconds, parseISO} from 'date-fns';

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
    includeCancellations,
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
    includeCancellations,
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

// --- v3 singleTrip utilities ---

export function isTransitLeg(leg: Leg): boolean {
  return leg.serviceJourney != null;
}

/**
 * Checks if any leg N+1's expectedStartTime is before leg N's expectedEndTime,
 * indicating a missed connection (impossible trip).
 */
export function hasTemporalOverlap(legs: Leg[]): boolean {
  for (let i = 1; i < legs.length; i++) {
    const prev = legs[i - 1];
    const curr = legs[i];
    if (parseISO(curr.expectedStartTime) < parseISO(prev.expectedEndTime)) {
      return true;
    }
  }
  return false;
}

/**
 * Computes correct aimedStartTime and aimedEndTime for a trip pattern.
 * Handles the Entur quirk where foot legs (and other non-quay legs) have
 * aimed times equal to expected times. For those legs, we derive the aimed
 * time from adjacent transit legs with quays.
 */
export function computeAimedTimes(legs: Leg[]): {
  aimedStartTime: string;
  aimedEndTime: string;
} {
  if (legs.length === 0) {
    return {aimedStartTime: '', aimedEndTime: ''};
  }

  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  let aimedStartTime = firstLeg.aimedStartTime;
  let aimedEndTime = lastLeg.aimedEndTime;

  if (legs.some((leg) => !isTransitLeg(leg))) {
    if (!isTransitLeg(firstLeg)) {
      const firstTransitIndex = legs.findIndex(isTransitLeg);
      if (firstTransitIndex !== -1) {
        const firstTransit = legs[firstTransitIndex];
        const durationBefore = legs
          .slice(0, firstTransitIndex)
          .reduce((acc, leg) => acc + leg.duration, 0);
        aimedStartTime = addSeconds(
          parseISO(firstTransit.aimedStartTime),
          -durationBefore,
        ).toISOString();
      }
    }

    if (!isTransitLeg(lastLeg)) {
      const reversedLegs = [...legs].reverse();
      const lastTransitIndex = reversedLegs.findIndex(isTransitLeg);
      if (lastTransitIndex !== -1) {
        const lastTransit = reversedLegs[lastTransitIndex];
        const durationAfter = reversedLegs
          .slice(0, lastTransitIndex)
          .reduce((acc, leg) => acc + leg.duration, 0);
        aimedEndTime = addSeconds(
          parseISO(lastTransit.aimedEndTime),
          durationAfter,
        ).toISOString();
      }
    }
  }

  return {aimedStartTime, aimedEndTime};
}

const STALE_THRESHOLD_SECONDS = 10;

/**
 * Determines the overall trip pattern status.
 * Priority: stale > impossible > valid
 *
 * Staleness is derived from the `refreshedAt` timestamps on each leg.
 * A stale leg typically occurs when the RefreshLeg(id) call fails,
 * causing the leg to keep its old `refreshedAt` while other legs get
 * a fresh timestamp. A leg is considered stale if its `refreshedAt` is
 * more than STALE_THRESHOLD_SECONDS older than the most recently refreshed leg.
 *
 * We compare against the newest leg rather than the current time to avoid
 * false positives: if the batch of parallel leg refreshes takes a few
 * seconds, early-refreshed legs would otherwise appear stale relative
 * to `Date.now()`.
 */
export function determineTripStatus(legs: Leg[]): TripPatternStatus {
  if (hasStaleLegs(legs)) {
    return 'stale';
  }
  if (hasTemporalOverlap(legs)) {
    return 'impossible';
  }
  return 'valid';
}

function hasStaleLegs(legs: Leg[]): boolean {
  const timestamps = legs
    .map((leg) => leg.refreshedAt)
    .filter((t): t is string => t != null)
    .map((t) => new Date(t).getTime());

  if (timestamps.length === 0) {
    return false;
  }

  const newest = Math.max(...timestamps);
  return timestamps.some(
    (t) => newest - t > STALE_THRESHOLD_SECONDS * 1000,
  );
}
