import {Location, QueryMode} from '@entur/sdk';
import {
  DestinationDisplay,
  Mode,
  PointsOnLink,
  TransportMode,
  TransportSubmode,
} from '../graphql/journey/journeyplanner-types_v3';
import {FormFactor} from '../graphql/mobility/mobility-types_v2';
import * as Types from '../graphql/vehicles/vehicles-types_v1';
import {CursoredQuery} from './cursored';
import {GetServiceJourneyVehicleQuery} from './impl/vehicles/vehicles-gql/vehicles.graphql-gen';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type FavoriteDeparture = {
  stopId: string;
  /** @deprecated Use destinationDisplay instead */
  lineName?: string; // kept for backward compatibility
  destinationDisplay?: DestinationDisplay;
  lineId: string;
  quayId?: string;
};

export type FeaturesQuery = {
  query: string;
  lat: number;
  lon: number;
  layers?: Array<'address' | 'venue'>;
  tariff_zone_authorities?: string[];
  limit?: number;
  multiModal: 'parent' | 'child' | 'all';
};

export interface QuaysCoordinatesPayload {
  ids: string[];
}

export interface StopPlacesByModeQuery {
  authorities: string[];
  transportModes: TransportMode[];
  transportSubmodes?: TransportSubmode[];
}

export interface StopPlaceConnectionsQuery {
  authorities: string[];
  fromStopPlaceId: string;
  transportModes?: TransportMode[];
  transportSubmodes?: TransportSubmode[];
}

export type StopPlaces = Array<{
  name: string;
  id: string;
  latitude?: number;
  longitude?: number;
}>;

export type ReverseFeaturesQuery = {
  lat: number;
  lon: number;
  limit?: number;
  layers?: Array<'address' | 'venue'>;
};

export type DepartureGroupsPayload = {
  location:
    | {
        layer: 'address';
        coordinates: {longitude: number; latitude: number};
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
  includeCancelledTrips: boolean;
}>;

export type DepartureRealtimeQuery = {
  quayIds: string[];
  startTime: Date;
  limit: number;
  limitPerLine?: number;
  lineIds?: string[];
  timeRange?: number;
};

export type QuayDeparturesQueryVariables = {
  id: string;
  numberOfDepartures?: number;
  startTime?: string;
  timeRange?: number;
  filterByLineIds?: string[];
  limitPerLine?: number;
};

export type DeparturesPayload = {
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
  minimumTransferTime?: number;
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
    aimedDepartureTime: string;
  };
};

export type DepartureRealtimeData = {
  quayId: string;
  departures: {[serviceJourneyId: string]: RealtimeData};
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

export type ServiceJourneyVehicleQueryVariables = {
  serviceJourneyIds: string[];
};

export type ServiceJourneySubscriptionQueryVariables = {
  serviceJourneyId: string;
};

export type GetServiceJourneyVehicles = Required<
  Required<GetServiceJourneyVehicleQuery>['vehicles']
>;

export type ServiceJourneyVehicles = Array<{
  lastUpdated?: any;
  bearing?: number;
  mode?: Types.VehicleModeEnumeration;
  location?: {latitude: number; longitude: number};
  serviceJourney?: {id: string};
}>;

export type VehicleQuery = {
  ids: string | string[];
};

export type VehiclesQuery = {
  lat: number;
  lon: number;
  range: number;
  formFactors?: FormFactor | FormFactor[];
  operators?: string[];
};

export type VehiclesQuery_v2 = {
  lat: number;
  lon: number;
  range: number;
  includeScooters: boolean;
  scooterOperators?: string[];
  includeBicycles: boolean;
  bicycleOperators?: string[];
};

export type StationsQuery = {
  lat: number;
  lon: number;
  range: number;
  availableFormFactors?: FormFactor | FormFactor[];
  operators?: string[];
};

export type StationsQuery_v2 = {
  lat: number;
  lon: number;
  range: number;
  includeBicycles: boolean;
  bicycleOperators?: string[];
  includeCars: boolean;
  carOperators?: string[];
};

export type CarStationQuery = {ids: string[]};
export type BikeStationQuery = {ids: string[]};

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

export type ViolationsReportingInitQuery = {
  lng: string;
  lat: string;
};

export type ViolationsReportingProvider = {
  id: number;
  name: string;
  image: {
    type: string;
    base64: string;
  };
};
export type ParkingViolationType = {
  code: string;
  icon: string;
};
export type ViolationsReportingInitQueryResult = {
  providers: ViolationsReportingProvider[];
  violations: ParkingViolationType[];
};

export type ViolationsVehicleLookupQuery = {
  qr: string;
};

export type ViolationsVehicleLookupQueryResult = {
  provider_id: number;
  vehicle_id: string;
};

export type ViolationsReportQuery = {
  providerId: ViolationsReportingProvider['id'];
  longitude: number;
  latitude: number;
  image?: string; //base64 encoded image blob
  imageType?: string; // file name suffix;
  qr?: string;
  appId?: string; // Unique id identifying the customer
  violations?: ParkingViolationType['code'][];
  timestamp: string;
};

export type ViolationsReportQueryResult = {
  status: 'OK';
};
