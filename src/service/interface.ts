import {Result} from '@badrap/result';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {TripPattern} from '@entur/sdk';
import {Boom} from '@hapi/boom';
import WebSocket from 'ws';
import {Subscription} from 'zen-observable-ts';
import * as Trips from '../types/trips';
import {DepartureGroupMetadata} from './impl/departures-grouped/departure-group';
import {
  DeparturesQuery,
  DeparturesQueryVariables,
} from './impl/departures/journey-gql/departures.graphql-gen';
import {
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables,
} from './impl/departures/journey-gql/stop-departures.graphql-gen';
import {
  StopsDetailsQuery,
  StopsDetailsQueryVariables,
} from './impl/departures/journey-gql/stops-details.graphql-gen';
import {
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables,
} from './impl/departures/journey-gql/stops-nearest.graphql-gen';
import {EnrollResponse} from './impl/enrollment';
import {ServiceJourneyWithEstCallsFragment} from './impl/fragments/journey-gql/service-journey.graphql-gen';
import {VehicleBasicFragment} from './impl/fragments/mobility-gql/vehicles.graphql-gen';
import {
  GetBikeStationQuery,
  GetCarStationQuery,
  GetStations_V2Query,
  GetStationsQuery,
} from './impl/mobility/mobility-gql/stations.graphql-gen';
import {
  GetVehicleQuery,
  GetVehicles_V2Query,
  GetVehiclesQuery,
} from './impl/mobility/mobility-gql/vehicles.graphql-gen';
import {GetQuaysCoordinatesQuery} from './impl/quays/journey-gql/quays-coordinates.graphql-gen';
import {ServiceJourneyEstimatedCallFragment} from './impl/service-journey/journey-gql/service-journey-departures.graphql-gen';
import {
  TripsQuery,
  TripsQueryVariables,
} from './impl/trips/journey-gql/trip.graphql-gen';
import {
  BikeStationQuery,
  CarStationQuery,
  DepartureFavoritesPayload,
  DepartureFavoritesQuery,
  DepartureGroupsPayload,
  DepartureGroupsQuery,
  DepartureRealtimeQuery,
  DeparturesForServiceJourneyQuery,
  DeparturesPayload,
  DeparturesRealtimeData,
  FeaturesQuery,
  QuaysCoordinatesPayload,
  ReverseFeaturesQuery,
  ServiceJourneyMapInfoData,
  ServiceJourneyMapInfoQuery,
  ServiceJourneySubscriptionQueryVariables,
  ServiceJourneyVehicleQueryVariables,
  ServiceJourneyVehicles,
  ServiceJourneyWithEstimatedCallsQuery,
  StationsQuery,
  StationsQuery_v2,
  StopPlaceConnectionsQuery,
  StopPlaces,
  StopPlacesByModeQuery,
  TripPatternsQuery,
  VehicleQuery,
  VehiclesQuery,
  VehiclesQuery_v2,
  ViolationsReportingInitQuery,
  ViolationsReportingInitQueryResult,
  ViolationsReportQuery,
  ViolationsReportQueryResult,
  ViolationsVehicleLookupQuery,
  ViolationsVehicleLookupQueryResult,
} from './types';
import {APIError} from '../utils/api-error';
import {Feature, Point} from 'geojson';
import {Location} from '../types/geocoder';
import {NonTransitTripsQueryVariables} from '../types/trips';
import {TripPatternFragment} from './impl/fragments/journey-gql/trips.graphql-gen';

export interface IGeocoderService {
  getFeatures(
    query: FeaturesQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<Feature<Point, Location>[], APIError>>;

  getFeaturesReverse(
    query: ReverseFeaturesQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<Feature<Point, Location>[], APIError>>;
}

export interface IServiceJourneyService_v2 {
  getServiceJourneyMapInfo(
    serviceJourneyId: string,
    query: ServiceJourneyMapInfoQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyMapInfoData, APIError>>;
  getDeparturesForServiceJourneyV2(
    id: string,
    query: DeparturesForServiceJourneyQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyEstimatedCallFragment[] | null, APIError>>;
  getServiceJourneyWithEstimatedCallsV2(
    id: string,
    query: ServiceJourneyWithEstimatedCallsQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyWithEstCallsFragment | null, APIError>>;
}

export interface ITrips_v2 {
  getTrips(
    query: TripsQueryVariables,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<TripsQuery, APIError>>;
  getNonTransitTrips(
    query: NonTransitTripsQueryVariables,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<TripPatternFragment[], APIError>>;
  getSingleTrip(
    query: Trips.TripsQueryWithJourneyIds,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<Trips.TripPattern, Boom>>;
  getTripPatterns(
    query: TripPatternsQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<TripPattern[], APIError>>;
}

export interface IDeparturesGroupedService {
  getDeparturesGrouped(
    location: DepartureGroupsPayload,
    query: DepartureGroupsQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<DepartureGroupMetadata, APIError>>;
  getDeparturesFavorites(
    location: DepartureFavoritesPayload,
    query: DepartureFavoritesQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<DepartureGroupMetadata, APIError>>;
}

export interface IRealtimeService {
  getDepartureRealtime(
    query: DepartureRealtimeQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<DeparturesRealtimeData, APIError>>;
}

export interface IDeparturesService {
  getDepartures(
    query: DeparturesQueryVariables,
    payload: DeparturesPayload,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<DeparturesQuery, APIError>>;
  getStopPlacesByPosition(
    query: NearestStopPlacesQueryVariables,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<NearestStopPlacesQuery, APIError>>;
  getStopsDetails(
    query: StopsDetailsQueryVariables,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<StopsDetailsQuery, APIError>>;
  getStopQuayDepartures(
    query: StopPlaceQuayDeparturesQueryVariables,
    headers: Request<ReqRefDefaults>,
    payload?: DeparturesPayload,
  ): Promise<Result<StopPlaceQuayDeparturesQuery, APIError>>;
}

export interface IQuayService {
  getQuaysCoordinates(
    payload: QuaysCoordinatesPayload,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetQuaysCoordinatesQuery, APIError>>;
}

export interface IStopPlacesService {
  getStopPlacesByMode(
    query: StopPlacesByModeQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<StopPlaces, APIError>>;
  getStopPlaceConnections(
    query: StopPlaceConnectionsQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<StopPlaces, APIError>>;
}

export interface IEnrollmentService {
  enroll(
    customerAccountId: string,
    enrollmentId: string,
    code: string,
  ): Promise<Result<EnrollResponse, APIError>>;
}

export interface IVehiclesService {
  getServiceJourneyVehicles(
    query: ServiceJourneyVehicleQueryVariables,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyVehicles, APIError>>;
  createServiceJourneySubscription(
    query: ServiceJourneySubscriptionQueryVariables,
    ws: WebSocket.WebSocket,
  ): Subscription;
}

export type VehicleFragment = Pick<
  VehicleBasicFragment,
  'id' | 'lat' | 'lon' | 'currentFuelPercent'
>;
export type GetVehiclesListQuery = Omit<GetVehiclesQuery, 'vehicles'> & {
  vehicles?: Array<VehicleFragment>;
};

export interface IMobilityService {
  getVehicles(
    query: VehiclesQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetVehiclesListQuery, APIError>>;
  getVehicles_v2(
    query: VehiclesQuery_v2,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetVehicles_V2Query, APIError>>;
  getVehicle(
    query: VehicleQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetVehicleQuery, APIError>>;
  getStations(
    query: StationsQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetStationsQuery, APIError>>;
  getStations_v2(
    query: StationsQuery_v2,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetStations_V2Query, APIError>>;
  getCarStation(
    query: CarStationQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetCarStationQuery, APIError>>;
  getBikeStation(
    query: BikeStationQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<GetBikeStationQuery, APIError>>;
  initViolationsReporting(
    query: ViolationsReportingInitQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsReportingInitQueryResult, APIError>>;
  violationsVehicleLookup(
    query: ViolationsVehicleLookupQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsVehicleLookupQueryResult, APIError>>;
  sendViolationsReport(
    query: ViolationsReportQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsReportQueryResult, APIError>>;
}
