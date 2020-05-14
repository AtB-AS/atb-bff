import { Location, QueryMode, DeparturesById } from '@entur/sdk';
import { FetchError } from 'node-fetch';
import { boomify } from '@hapi/boom';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type FeaturesQuery = {
  query: string;
  lat: number;
  lon: number;
  'boundary.rect.min_lon'?: number;
  'boundary.rect.max_lon'?: number;
  'boundary.rect.min_lat'?: number;
  'boundary.rect.max_lat'?: number;
  'boundary.country'?: string;
  sources?: string[];
  layers?: string[];
  limit?: number;
};

export interface QuaysForStopPlaceQuery {
  filterByInUse: boolean;
}

export type ReverseFeaturesQuery = {
  lat: number;
  lon: number;
  radius?: number;
  limit?: number;
  layers?: string[];
};

export interface NearestDeparturesQuery {
  lat: number;
  lon: number;
  offset: number;
  walkSpeed: number;
  includeIrrelevant: boolean;
}

export interface StopPlaceQuery {
  lat: number;
  lon: number;
  distance?: number;
}

export interface StopPlaceByNameQuery {
  query: string;
  lat?: number;
  lon?: number;
}

export interface DeparturesFromStopPlaceQuery {
  start?: Date;
  timeRange?: number;
  limit?: number;
  includeNonBoarding?: boolean;
}

export interface DeparturesFromQuayQuery {
  start?: Date;
  timeRange: number;
  limit: number;
  omitNonBoarding: boolean;
  includeCancelledTrips: boolean;
}

export interface TripQuery {
  from: string;
  to: string;
  when?: Date;
}

export interface TripPatternsQuery {
  from: Location;
  to: Location;
  searchDate: Date;
  arriveBy: boolean;
  limit: number;
  modes: QueryMode[];
  wheelchairAccessible: boolean;
}

export interface SingleTripPatternQuery {
  id: string;
}

export interface TripPatternQuery {
  query: TripPatternsQuery;
  serviceIds: string[];
}

export interface NearestPlacesQuery {
  lat: number;
  lon: number;
  maxDistance?: number;
  limit?: number;
  typeFilter: string[];
  modeFilter: string[];
}

export interface DeparturesBetweenStopPlacesQuery {
  from: string;
  to: string;
}

export interface DeparturesForServiceJourneyQuery {
  date?: Date;
}

export interface NextDepartureFromStopQuery {
  from: string;
  to: string;
}

export interface DeparturesBetweenStopPlacesParams {
  limit?: number;
  start?: Date;
}

export type NextDepartureFromCoordinateQuery = {
  lat: number;
  lon: number;
  to: string;
};

export type DeparturesByIdWithStopName = DeparturesById & {
  name: string;
};

export class APIError extends Error {
  public statusCode?: number = 500;

  constructor(error: any) {
    super();
    if (error instanceof FetchError) {
      switch (error.code) {
        case 'ETIMEDOUT':
        case 'EPIPE':
        case 'ECONNRESET':
        case 'ECONNREFUSED':
        case 'ENOTFOUND':
          this.message = 'Upstream service temporarily unavailable';
          this.statusCode = 503;
      }
    }
    console.error(error);
    return boomify(this, {
      statusCode: this.statusCode,
      message: error.message
    });
  }
}
