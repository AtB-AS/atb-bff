import Joi from 'joi';
import { TripPattern } from '@entur/sdk';
import {
  TripsQueryVariables,
  TripsQuery
} from '../service/impl/trips/graphql/jp3/trip.graphql-gen';
import {
  Leg,
  TripPattern as TripPattern_v3,
  TripsQueryWithJourneyIds
} from '../types/trips';
import { TripPatternsQuery, TripPatternQuery } from '../service/types';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent
} from 'lz-string';
import { addSeconds, parseISO } from 'date-fns';

const START_TIME_PADDING = 60; // time in seconds
export function generateId(trip: TripPattern, query: TripPatternsQuery) {
  const fields: TripPatternsQuery = {
    searchDate: new Date(trip.startTime),
    ...query
  };
  const serviceIds = getServiceIds(trip);
  return compressToEncodedURIComponent(
    JSON.stringify({ query: fields, serviceIds })
  );
}

export function getServiceIds(trip: TripPattern) {
  return trip.legs.map(leg => leg.serviceJourney?.id ?? 'null');
}

export function parseTripPatternId(
  id: string,
  queryValidator: Joi.ObjectSchema<any>
): TripPatternQuery {
  try {
    const value = decompressFromEncodedURIComponent(id);
    if (!value) {
      throw new Error();
    }
    const fields = JSON.parse(value);
    fields.query = queryValidator.validate(fields.query).value;

    if (isTripPatternsQuery(fields.query) && Array.isArray(fields.serviceIds)) {
      return fields as TripPatternQuery;
    }
  } catch (_) {}

  throw new Error('Could not parse input trip id');
}

function isTripPatternsQuery(
  potentialTripPatternsQuery: any
): potentialTripPatternsQuery is TripPatternsQuery {
  return (
    'from' in potentialTripPatternsQuery &&
    'searchDate' in potentialTripPatternsQuery &&
    'modes' in potentialTripPatternsQuery
  );
}

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
  queryVariables: TripsQueryVariables
) {
  // extract journeyIds for all legs
  const journeyIds = extractServiceJourneyIds(trip);

  // sanitize query, and set search time.
  const when = getPaddedStartTimeFromLeg(trip.legs[0]);
  const {
    from,
    to,
    transferPenalty,
    waitReluctance,
    walkReluctance,
    walkSpeed,
    modes
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
    modes
  };

  // encode to string
  return compressToEncodedURIComponent(
    JSON.stringify({ query: singleTripQuery, journeyIds })
  );
}

function getPaddedStartTimeFromLeg(leg: Leg): string {
  const startTime = parseISO(leg.aimedStartTime);
  return addSeconds(startTime, -START_TIME_PADDING).toISOString();
}

/**
 * Maps a TripQueryString into QueryVariables and journeyIds
 * JourneyPlanner v3
 * @param compressedQueryString
 * @param queryValidator
 */
export function parseTripQueryString(
  compressedQueryString: string,
  queryValidator: Joi.ObjectSchema
): TripsQueryWithJourneyIds {
  const queryString = decompressFromEncodedURIComponent(compressedQueryString);
  if (!queryString) {
    throw new Error();
  }
  const queryFields = JSON.parse(queryString);
  queryValidator.validate(queryFields.query);

  return {
    query: queryFields.query,
    journeyIds: queryFields.journeyIds
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
    .map(leg => {
      return leg.serviceJourney?.id ?? null;
    })
    .filter(jId => {
      return !!jId;
    });
}
