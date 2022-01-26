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

const START_TIME_PADDING = 60   // time in seconds
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
 * JourneyPlanner v3
 * @param trip
 * @param queryVariables
 */
export function generateTripQueryString(
  trip: TripPattern_v3,
  queryVariables: TripsQueryVariables
) {
  // extract journeyIds for all legs
  const journeyIds = extractServiceJourneyIds(trip);

  // modify query to contain the padded aimed departure time of first leg
  const tripQuery: TripsQueryVariables = {
    ...queryVariables,
    when: getPaddedStartTime(trip.legs[0])
  };

  // encode to string
  return compressToEncodedURIComponent(
    JSON.stringify({ query: tripQuery, journeyIds })
  );
}

function getPaddedStartTime (leg: Leg): string {
  const startTimeInMillis = new Date(leg.aimedStartTime).getTime();
  const newStartTimeInMillis = startTimeInMillis - (1000 * START_TIME_PADDING);
  return new Date(newStartTimeInMillis).toISOString();
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
  queryValidator.validate(queryFields.query)

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
