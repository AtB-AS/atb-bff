import { Location, QueryMode } from '@entur/sdk';

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
  size?: number;
  layers?: string[];
};

export interface StopPlaceQuery {
  lat: number;
  lon: number;
  distance?: number;
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

export class APIError extends Error {
  constructor(public message: string) {
    super();
    this.name = 'APIError';
  }
}
