import {
  DestinationDisplay,
  Mode,
  PointsOnLink,
  TransportMode,
  TransportSubmode,
} from '../graphql/journey/journeyplanner-types_v3';
import * as Types from '../graphql/vehicles/vehicles-types_v1';
import {CursoredQuery} from './cursored';
import {GetServiceJourneyVehicleQuery} from './impl/vehicles/vehicles-gql/vehicles.graphql-gen';
import {DeparturesQuery} from './impl/departures/journey-gql/departures.graphql-gen';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type FavoriteDeparture = {
  /** @deprecated Use destinationDisplay instead */
  lineName?: string; // kept for backward compatibility
  destinationDisplay?: DestinationDisplay;
  lineId: string;
  quayId: string;
};

type EstimatedCallWithLineName =
  DeparturesQuery['quays'][0]['estimatedCalls'][0] & {
    lineName?: string;
  };
export type DeparturesWithLineName = DeparturesQuery & {
  quays: (DeparturesQuery['quays'][0] & {
    estimatedCalls: EstimatedCallWithLineName[];
  })[];
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

export interface StopPlaceParentQuery {
  id: string;
}

export type StopPlaces = Array<{
  name: string;
  id: string;
  latitude?: number;
  longitude?: number;
  transportMode?: TransportMode[];
}>;

export type ReverseFeaturesQuery = {
  lat: number;
  lon: number;
  limit?: number;
  layers?: Array<'address' | 'venue'>;
};

export type DepartureFavoritesPayload = {
  favorites: FavoriteDeparture[];
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

export type DeparturesPayload = {
  favorites?: FavoriteDeparture[];
};

export interface EnrollmentQuery {
  inviteKey: string;
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

export type VehiclesQuery_v2 = {
  lat: number;
  lon: number;
  range: number;
  includeScooters: boolean;
  scooterOperators?: string[];
  includeBicycles: boolean;
  bicycleOperators?: string[];
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

export type GeofencingZonesQuery = {systemIds: string[]};

export type ServiceJourneyMapInfoData = {
  mapLegs: MapLeg[];
  start?: Coordinates;
  stop?: Coordinates;
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
  } | null;
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
