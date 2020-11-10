import {
  Location,
  QueryMode,
  DeparturesById,
  Feature,
  StopPlaceDetails,
  Quay,
  Departure
} from '@entur/sdk';
import { FetchError } from 'node-fetch';
import { boomify } from '@hapi/boom';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type FeatureLocation = Feature['properties'] & {
  coordinates: { longitude: number; latitude: number };
};

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

export interface DeparturesFromLocationQuery {
  offset: number;
  walkSpeed: number;
  includeNonBoarding: boolean;
}

export type DeparturesFromLocationPagingQuery = PaginatedQuery<{
  startTime: Date;
  limit: number;
}>;

export type DepartureRealtimeQuery = {
  quayIds: string[];
  startTime: Date;
  limit: number;
};

export interface DeparturesFromQuayQuery {
  start?: Date;
  timeRange: number;
  limit: number;
  omitNonBoarding: boolean;
  includeCancelledTrips: boolean;
}

export interface EnrollmentQuery {
  inviteKey: string;
}

export interface TripQuery {
  from: string;
  to: string;
  when?: Date;
}

export interface TripPatternsQuery {
  from: Location;
  to: Location;
  searchDate?: Date;
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

export interface DeparturesBetweenStopPlacesParams {
  limit?: number;
  start?: Date;
}

export type DeparturesByIdWithStopName = DeparturesById & {
  name: string;
};

export type QuayWithCoordinates = Quay & {
  latitude?: number;
  longitude?: number;
};

export type DeparturesWithStop = {
  stop: StopPlaceDetails;
  quays: {
    [quayId: string]: {
      quay: QuayWithCoordinates;
      departures: Array<Departure>;
    };
  };
};

export type PaginationInput = {
  pageSize: number;
  pageOffset: number;
};

export type PaginatedQuery<T> = PaginationInput & T;

export type Paginated<T extends any[] | []> =
  | ({
      hasNext: true;
      nextPageOffset: number;

      data: T;
      totalResults: number;
    } & PaginationInput)
  | ({
      hasNext: false;

      data: T;
      totalResults: number;
    } & PaginationInput);

export type DeparturesMetadata = Paginated<DeparturesWithStop[]>;

export type RealtimeData = {
  serviceJourneyId: string;
  timeData: {
    realtime: boolean;
    expectedDepartureTime: string;
  };
};

export type DepartureRealtimeData = {
  quayId: string;
  departures: { [serviceJourneyId: string]: RealtimeData };
};

export type DeparturesRealtimeData = {
  [quayId: string]: DepartureRealtimeData;
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
    return boomify(this, {
      statusCode: this.statusCode,
      message: error.message
    });
  }
}
