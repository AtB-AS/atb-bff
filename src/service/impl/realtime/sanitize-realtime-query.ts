import type {DepartureRealtimeQuery} from '../../types';
import type {GetDepartureRealtimeQueryVariables} from './journey-gql/departure-time.graphql-gen';
import {addSeconds, differenceInSeconds, isAfter} from 'date-fns';

const END_PADDING_SECONDS = 30 * 60;
const START_PADDING_SECONDS = 3 * 60;

/**
 * Sanitize the input query to get the correct time range for the realtime
 * updates, since we should only fetch updates which are max END_PADDING_SECONDS
 * in the future and have just passed (max START_PADDING_SECONDS in the past)
 *
 * Undefined is returned if the input start time is far in the future, which
 * signals that no realtime updates should be fetched.
 */
export const sanitizeRealtimeQuery = (
  query: DepartureRealtimeQuery,
): GetDepartureRealtimeQueryVariables | undefined => {
  const now = new Date();
  const startTime = isAfter(query.startTime, now) ? query.startTime : now;

  const realtimeWindowEnd = addSeconds(now, END_PADDING_SECONDS);
  const realtimeWindowStart = addSeconds(startTime, -START_PADDING_SECONDS);

  const timeRange = differenceInSeconds(realtimeWindowEnd, realtimeWindowStart);
  if (timeRange <= 0) return undefined;

  const {lineIds, ...rest} = query;
  const filters = lineIds?.length ? [{select: [{lines: lineIds}]}] : undefined;

  return {...rest, startTime: realtimeWindowStart, timeRange, filters};
};
