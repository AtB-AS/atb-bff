import { Location, QueryMode } from '@entur/sdk';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FeaturesQuery {
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
}

export interface ReverseFeaturesQuery {
  lat: number;
  lon: number;
  radius?: number;
  size?: number;
  layers?: string[];
}

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

export class APIError extends Error {
  constructor(public message: string) {
    super();
    this.name = 'APIError';
  }
}
