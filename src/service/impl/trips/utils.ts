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
import {addSeconds, formatISO, parseISO} from 'date-fns';
import {isTransitLeg} from '@atb-as/utils';

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
    transferSlack,
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
    transferSlack,
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

/**
 * Checks if any leg N+1's expectedStartTime is before leg N's expectedEndTime,
 * indicating a missed connection (impossible trip).
 *
 * Overlaps at a guaranteed interchange are ignored: the connecting service has
 * committed to waiting for the delayed one, so a negative gap there is not a
 * missed connection.
 *
 * Duplicates `getLegTransferRisk` from `@atb-as/utils` on purpose, until clients
 * stop reading `status === 'impossible'`. Both now treat a gap of exactly zero
 * as fine; this one still differs in looking at every adjacent pair rather than
 * only the transit leg being boarded. Delete with the impossible branch.
 */
export function hasTemporalOverlap(legs: Leg[]): boolean {
  for (let i = 1; i < legs.length; i++) {
    const prev = legs[i - 1];
    const curr = legs[i];
    if (parseISO(curr.expectedStartTime) < parseISO(prev.expectedEndTime)) {
      if (interchangeHolds(legs, i)) continue;
      return true;
    }
  }
  return false;
}

/**
 * Whether the interchange into the leg at `index` still guarantees the
 * connection. A guarantee lasts `maximumWaitTime` seconds past the connecting
 * service's scheduled departure; absent, it waits indefinitely. Arrival is the
 * end of the leg immediately before, so an intervening walk counts.
 */
function interchangeHolds(legs: Leg[], index: number): boolean {
  const interchange = previousTransitLeg(legs, index)?.interchangeTo;
  if (interchange?.guaranteed !== true) return false;
  if (interchange.maximumWaitTime == null) return true;

  const deadline = addSeconds(
    parseISO(legs[index].aimedStartTime),
    interchange.maximumWaitTime,
  );
  const arrival = parseISO(legs[index - 1].expectedEndTime);
  // Bad data suppresses a warning rather than inventing one.
  if (isNaN(deadline.getTime()) || isNaN(arrival.getTime())) return true;

  return arrival <= deadline;
}

/**
 * The transit leg you alight from, which carries the interchange. Walks back
 * past non-transit legs: bus -> walk -> bus overlaps on the (walk, bus) pair,
 * but the first bus holds `interchangeTo`.
 */
function previousTransitLeg(legs: Leg[], index: number): Leg | undefined {
  for (let i = index - 1; i >= 0; i--) {
    if (isTransitLeg(legs[i])) return legs[i];
  }
  return undefined;
}

/**
 * Computes the trip-level aimedStartTime and aimedEndTime.
 *
 * Entur quirk: non-transit legs (foot, bicycle, etc.) have no real scheduled
 * times — their aimed times are always equal to their expected times. To get
 * correct trip-level aimed boundaries, we derive them from the nearest transit
 * legs and subtract/add the non-transit leg durations.
 */
export function computeTripAimedStartEnd(legs: Leg[]): {
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
        aimedStartTime = formatISO(
          addSeconds(parseISO(firstTransit.aimedStartTime), -durationBefore),
        );
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
        aimedEndTime = formatISO(
          addSeconds(parseISO(lastTransit.aimedEndTime), durationAfter),
        );
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
    .map((t) => new Date(t).getTime())
    .filter((t) => !isNaN(t));

  if (timestamps.length === 0) {
    return false;
  }

  const newest = Math.max(...timestamps);
  return timestamps.some((t) => newest - t > STALE_THRESHOLD_SECONDS * 1000);
}

/**
 * Adjusts expectedStartTime and expectedEndTime on non-transit legs based on
 * updated expected times from adjacent transit legs.
 *
 * After refreshing transit legs, non-transit leg expected times become stale —
 * they still reflect the original schedule even though adjacent transit legs
 * may have shifted due to delays. This function recalculates them:
 *
 * - Leading non-transit leg: derived from first transit leg's expectedStartTime
 * - Trailing non-transit leg: derived from last transit leg's expectedEndTime
 * - Intermediate non-transit legs: chain forward from previous transit leg's
 *   expectedEndTime, each leg's end becoming the next leg's start. Any remaining
 *   gap before the next transit leg is wait time.
 *
 * Assumes at most one leading and one trailing non-transit leg — which matches
 * how Entur structures trip patterns (a single walk to/from the first/last stop).
 *
 * Transit legs are returned unchanged. If there are no transit legs, all legs
 * are returned unchanged (no anchor to derive from).
 */
export function adjustNonTransitExpectedTimes(legs: Leg[]): Leg[] {
  const firstTransitIndex = legs.findIndex(isTransitLeg);
  if (firstTransitIndex === -1) {
    return legs;
  }

  const lastTransitIndex = findLastIndex(legs, isTransitLeg);

  return legs.map((leg, i) => {
    if (isTransitLeg(leg)) return leg;

    // Leading non-transit leg: the single leg immediately before first transit
    if (i === firstTransitIndex - 1) {
      const transitStart = parseISO(legs[firstTransitIndex].expectedStartTime);
      return {
        ...leg,
        expectedStartTime: addSeconds(
          transitStart,
          -leg.duration,
        ).toISOString(),
        expectedEndTime: transitStart.toISOString(),
      };
    }

    // Trailing non-transit leg: the single leg immediately after last transit
    if (i === lastTransitIndex + 1) {
      const transitEnd = parseISO(legs[lastTransitIndex].expectedEndTime);
      return {
        ...leg,
        expectedStartTime: transitEnd.toISOString(),
        expectedEndTime: addSeconds(transitEnd, leg.duration).toISOString(),
      };
    }

    // Intermediate: the legs between two transit legs are non-scheduled walks/
    // transfers whose times are derived from the previous transit leg's end time.
    // When there are multiple consecutive non-transit legs, we need to account
    // for the duration of the ones before this one. durationBefore is the sum of
    // durations of non-transit legs between the previous transit leg and this leg.
    // In the common case of a single walk leg, durationBefore is 0 and the leg
    // starts directly at the previous transit leg's end time.
    // This assumes all non-transit legs between two transit legs are sequential
    // with no gaps — any wait time comes after the last non-transit leg.
    const prevTransitIdx = findLastIndex(legs.slice(0, i), isTransitLeg);
    const durationBefore = legs
      .slice(prevTransitIdx + 1, i)
      .reduce((acc, l) => acc + l.duration, 0);
    const anchor = parseISO(legs[prevTransitIdx].expectedEndTime);
    const start = addSeconds(anchor, durationBefore);
    return {
      ...leg,
      expectedStartTime: start.toISOString(),
      expectedEndTime: addSeconds(start, leg.duration).toISOString(),
    };
  });
}

// Array.prototype.findLastIndex requires ES2023 target, which this project
// does not use. This is a simple polyfill.
function findLastIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}
