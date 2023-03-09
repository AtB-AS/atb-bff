import { Location, QueryMode } from '@entur/sdk';
import { boomify } from '@hapi/boom';
import { FetchError } from 'node-fetch';
import {
  Mode,
  PointsOnLink,
  TransportSubmode
} from '../graphql/journey/journeyplanner-types_v3';
import * as Mobility from '../graphql/mobility/mobility-types_v2';
import { CursoredQuery } from './cursored';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type FavoriteDeparture = {
  stopId: string;
  lineName?: string;
  lineId: string;
  quayId?: string;
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
  tariff_zone_authorities?: string;
  limit?: number;

  multiModal: 'parent' | 'child' | 'all';

  'focus.weight'?: number;
  'focus.function'?: 'linear' | 'exp';
  'focus.scale'?: 'string';
};

export interface QuaysCoordinatesPayload {
  ids: string[];
}

export type ReverseFeaturesQuery = {
  lat: number;
  lon: number;
  radius?: number;
  limit?: number;
  layers?: string[];
};

export type DepartureGroupsPayload = {
  location:
    | {
        layer: 'address';
        coordinates: { longitude: number; latitude: number };
      }
    | {
        layer: 'venue';
        id: string;
      };
  favorites?: FavoriteDeparture[];
};

export type DepartureGroupsQuery = CursoredQuery<{
  startTime: Date;
  limitPerLine: number;
  includeCancelledTrips?: boolean;
}>;

export type DepartureFavoritesPayload = {
  favorites?: FavoriteDeparture[];
};

export type DepartureFavoritesQuery = CursoredQuery<{
  startTime: Date;
  limitPerLine: number;
}>;

export type DepartureRealtimeQuery = {
  quayIds: string[];
  startTime: Date;
  limit: number;
  limitPerLine?: number;
  lineIds?: string[];
};

export type StopPlaceDeparturesPayload = {
  favorites?: FavoriteDeparture[];
};

export type QuayDeparturesPayload = {
  favorites?: FavoriteDeparture[];
};

export interface EnrollmentQuery {
  inviteKey: string;
}

export interface TripPatternsQuery {
  from: Location;
  to: Location;
  searchDate?: Date;
  arriveBy: boolean;
  limit: number;
  maxTransferWalkDistance: number; // Meters. Defaults to 2000 in Entur
  maxPreTransitWalkDistance: number; // Meters. Defaults to alot in Entur
  walkReluctance: number; // Factor. Defaults to 4 in Entur
  modes: QueryMode[];
  wheelchairAccessible: boolean;
}

export interface DeparturesForServiceJourneyQuery {
  date?: Date;
}

export interface ServiceJourneyWithEstimatedCallsQuery {
  date?: Date;
}

export interface ServiceJourneyMapInfoQuery {
  fromQuayId: string;
  toQuayId?: string;
}

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

export type MapLeg = {
  mode?: Mode;
  faded: boolean;
  transportSubmode?: TransportSubmode;
  pointsOnLink: PointsOnLink;
};

export type Scooter = {
  id: string;
  lat: number;
  lon: number;
};

export type VehiclesQuery = Pick<
  Mobility.QueryVehiclesArgs,
  'lat' | 'lon' | 'range' | 'operators' | 'formFactors'
>;

export type StationsQuery = Pick<
  Mobility.QueryStationsArgs,
  'lat' | 'lon' | 'range' | 'operators' | 'availableFormFactors'
>;

export type ServiceJourneyMapInfoData = {
  mapLegs: MapLeg[];
  start?: Coordinates;
  stop?: Coordinates;
};

export type VippsCustomTokenRequest = {
  authorizationCode: string;
  state: string;
  nonce: string;
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
