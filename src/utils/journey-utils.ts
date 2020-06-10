import Joi from '@hapi/joi';
import { TripPattern } from '@entur/sdk';
import { TripPatternsQuery, TripPatternQuery } from '../service/types';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent
} from 'lz-string';

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
