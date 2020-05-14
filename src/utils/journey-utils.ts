import Joi from '@hapi/joi';
import { TripPattern } from '@entur/sdk';
import { TripPatternsQuery, TripPatternQuery } from '../service/types';

export function generateId(trip: TripPattern, query: TripPatternsQuery) {
  const fields: TripPatternsQuery = {
    searchDate: new Date(trip.startTime),
    ...query
  };
  const serviceIds = getServiceIds(trip);
  return Buffer.from(JSON.stringify({ query: fields, serviceIds })).toString(
    'base64'
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
    const fields = JSON.parse(Buffer.from(id, 'base64').toString());
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
