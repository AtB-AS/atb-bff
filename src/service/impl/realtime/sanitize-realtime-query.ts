import type {DepartureRealtimeQuery} from '../../types';
import type {GetDepartureRealtimeQueryVariables} from './journey-gql/departure-time.graphql-gen';
import {addMinutes, differenceInSeconds, isAfter} from 'date-fns';

const REALTIME_MINUTES = 30;

/**
 * Sanitize the input query to get the correct time range for the realtime
 * updates, since we should only fetch updates which are between now and 30
 * minutes in the feature.
 *
 * Undefined is returned if the input start time is more than 30 minutes in the
 * future, which signals that no realtime updates should be fetched.
 */
export const sanitizeRealtimeQuery = (
  query: DepartureRealtimeQuery,
): GetDepartureRealtimeQueryVariables | undefined => {
  const now = new Date();
  const startTime = isAfter(query.startTime, now) ? query.startTime : now;
  const realtimeWindowEnd = addMinutes(now, REALTIME_MINUTES);
  const timeRange = differenceInSeconds(realtimeWindowEnd, startTime);

  return timeRange > 0 ? {...query, startTime, timeRange} : undefined;
};
