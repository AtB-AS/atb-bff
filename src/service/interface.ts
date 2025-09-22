import {Result} from '@badrap/result';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {Boom} from '@hapi/boom';
import WebSocket from 'ws';
import {Subscription} from 'zen-observable-ts';
import * as Trips from '../types/trips';
import {DeparturesQueryVariables} from './impl/departures/journey-gql/departures.graphql-gen';
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
import {
  GetBikeStationQuery,
  GetCarStationQuery,
  GetStations_V2Query,
} from './impl/mobility/mobility-gql/stations.graphql-gen';
import {GetGeofencingZonesQuery} from './impl/mobility/mobility-gql/geofencing-zones.graphql-gen';
import {
  GetVehicleQuery,
  GetVehicles_V2Query,
} from './impl/mobility/mobility-gql/vehicles.graphql-gen';
import {GetQuaysCoordinatesQuery} from './impl/quays/journey-gql/quays-coordinates.graphql-gen';
import {ServiceJourneyEstimatedCallFragment} from './impl/service-journey/journey-gql/service-journey-departures.graphql-gen';
import {
  TripsQuery,
  TripsQueryVariables,
} from './impl/trips/journey-gql/trip.graphql-gen';
import {
  GeofencingZonesQuery,
  BikeStationQuery,
  CarStationQuery,
  DepartureFavoritesPayload,
  DepartureFavoritesQuery,
  DepartureRealtimeQuery,
  DeparturesForServiceJourneyQuery,
  DeparturesPayload,
  DeparturesRealtimeData,
  DeparturesWithLineName,
  FeaturesQuery,
  QuaysCoordinatesPayload,
  ReverseFeaturesQuery,
  ServiceJourneyMapInfoData,
  ServiceJourneyMapInfoQuery,
  ServiceJourneySubscriptionQueryVariables,
  ServiceJourneyVehicleQueryVariables,
  ServiceJourneyVehicles,
  ServiceJourneyWithEstimatedCallsQuery,
  StationsQuery_v2,
  StopPlaceConnectionsQuery,
  StopPlaces,
  StopPlacesByModeQuery,
  VehicleQuery,
  VehiclesQuery_v2,
  ViolationsReportingInitQuery,
  ViolationsReportingInitQueryResult,
  ViolationsReportQuery,
  ViolationsReportQueryResult,
  ViolationsVehicleLookupQuery,
  ViolationsVehicleLookupQueryResult,
  StopPlaceParentQuery,
} from './types';
import {APIError} from '../utils/api-error';
import {Feature, Point} from 'geojson';
import {Location} from '../types/geocoder';
import {
  NonTransitTripsQueryVariables,
  BookingTripsQueryParameters,
  BookingTripsQueryPayload,
} from '../types/trips';
import {TripPatternFragment} from './impl/fragments/journey-gql/trips.graphql-gen';
import {CursoredData} from './cursored';
import {StopPlaceGroup} from './impl/departures-grouped/utils/grouping';
import {DatedServiceJourneyQuery} from './impl/service-journey/journey-gql/dated-service-journey.graphql-gen';

export interface IGeocoderService {
  getFeatures(
    query: FeaturesQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<Feature<Point, Location>[], APIError>>;

  getFeaturesReverse(
    query: ReverseFeaturesQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<Feature<Point, Location>[], APIError>>;
}

export interface IServiceJourneyService_v2 {
  getServiceJourneyMapInfo(
    serviceJourneyId: string,
    query: ServiceJourneyMapInfoQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyMapInfoData, APIError>>;

  getDeparturesForServiceJourneyV2(
    id: string,
    query: DeparturesForServiceJourneyQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyEstimatedCallFragment[] | null, APIError>>;

  getServiceJourneyWithEstimatedCallsV2(
    id: string,
    query: ServiceJourneyWithEstimatedCallsQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyWithEstCallsFragment | null, APIError>>;

  getDatedServiceJourney(
    id: string,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<DatedServiceJourneyQuery['datedServiceJourney'], APIError>>;
}

export interface ITrips_v2 {
  getTrips(
    query: TripsQueryVariables,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<TripsQuery, APIError>>;

  getNonTransitTrips(
    query: NonTransitTripsQueryVariables,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<TripPatternFragment[], APIError>>;

  getBookingTrips(
    query: BookingTripsQueryParameters,
    payload: BookingTripsQueryPayload,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<Trips.BookingTripsQuery, APIError>>;

  getSingleTrip(
    query: Trips.TripsQueryWithJourneyIds,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<Trips.TripPattern, Boom>>;
}

export interface IDeparturesGroupedService {
  getDeparturesFavorites(
    location: DepartureFavoritesPayload,
    query: DepartureFavoritesQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<CursoredData<StopPlaceGroup[]>, APIError>>;
}

export interface IRealtimeService {
  getDepartureRealtime(
    query: DepartureRealtimeQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<DeparturesRealtimeData, APIError>>;
}

export interface IDeparturesService {
  getDepartures(
    query: DeparturesQueryVariables,
    payload: DeparturesPayload,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<DeparturesWithLineName, APIError>>;

  getStopPlacesByPosition(
    query: NearestStopPlacesQueryVariables,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<NearestStopPlacesQuery, APIError>>;

  getStopsDetails(
    query: StopsDetailsQueryVariables,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<StopsDetailsQuery, APIError>>;
}

export interface IQuayService {
  getQuaysCoordinates(
    payload: QuaysCoordinatesPayload,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<GetQuaysCoordinatesQuery, APIError>>;
}

export interface IStopPlacesService {
  getStopPlacesByMode(
    query: StopPlacesByModeQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<StopPlaces, APIError>>;

  getStopPlaceConnections(
    query: StopPlaceConnectionsQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<StopPlaces, APIError>>;

  getStopPlaceParent(
    query: StopPlaceParentQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<string, APIError>>;

  getStopPlaceDistances(
    query: StopPlaceConnectionsQuery,
    request: Request<ReqRefDefaults>,
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
    request: Request<ReqRefDefaults>,
  ): Promise<Result<ServiceJourneyVehicles, APIError>>;

  createServiceJourneySubscription(
    query: ServiceJourneySubscriptionQueryVariables,
    ws: WebSocket.WebSocket,
  ): Subscription;
}

export interface IMobilityService {
  getVehicles_v2(
    query: VehiclesQuery_v2,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<GetVehicles_V2Query, APIError>>;

  getVehicle(
    query: VehicleQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<GetVehicleQuery, APIError>>;

  getStations_v2(
    query: StationsQuery_v2,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<GetStations_V2Query, APIError>>;

  getCarStation(
    query: CarStationQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<GetCarStationQuery, APIError>>;

  getBikeStation(
    query: BikeStationQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<GetBikeStationQuery, APIError>>;

  getGeofencingZones(
    query: GeofencingZonesQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<GetGeofencingZonesQuery, APIError>>;

  initViolationsReporting(
    query: ViolationsReportingInitQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsReportingInitQueryResult, APIError>>;

  violationsVehicleLookup(
    query: ViolationsVehicleLookupQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsVehicleLookupQueryResult, APIError>>;

  sendViolationsReport(
    query: ViolationsReportQuery,
    request: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsReportQueryResult, APIError>>;
}
