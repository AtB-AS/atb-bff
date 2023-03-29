import { Result } from '@badrap/result';
import { Feature, TripPattern } from '@entur/sdk';
import { Boom } from '@hapi/boom';
import * as Trips from '../types/trips';
import {
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables
} from './impl/departures/journey-gql/stop-departures.graphql-gen';
import {
  StopsDetailsQuery,
  StopsDetailsQueryVariables
} from './impl/departures/journey-gql/stops-details.graphql-gen';
import {
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables
} from './impl/departures/journey-gql/stops-nearest.graphql-gen';
import { EnrollResponse } from './impl/enrollment';
import { ServiceJourneyWithEstCallsFragment } from './impl/fragments/journey-gql/service-journey.graphql-gen';
import { GetQuaysCoordinatesQuery } from './impl/quays/journey-gql/quays-coordinates.graphql-gen';
import { ServiceJourneyEstimatedCallFragment } from './impl/service-journey/journey-gql/service-journey-departures.graphql-gen';
import { DepartureGroupMetadata } from './impl/departures-grouped/departure-group';
import {
  APIError,
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
  ServiceJourneyVehicleQueryVariables,
  ServiceJourneyVehicles,
  ServiceJourneyWithEstimatedCallsQuery,
  StationsQuery,
  TripPatternsQuery,
  VehiclesQuery
} from './types';
import { GetVehiclesQuery } from './impl/mobility/mobility-gql/vehicles.graphql-gen';
import {
  TripsQuery,
  TripsQueryVariables
} from './impl/trips/journey-gql/trip.graphql-gen';
import { GetStationsQuery } from './impl/mobility/mobility-gql/stations.graphql-gen';
import {
  DeparturesQuery,
  DeparturesQueryVariables
} from './impl/departures/journey-gql/departures.graphql-gen';

export interface IGeocoderService {
  getFeatures(query: FeaturesQuery): Promise<Result<Feature[], APIError>>;

  getFeaturesReverse(
    query: ReverseFeaturesQuery
  ): Promise<Result<Feature[], APIError>>;
}

export interface IServiceJourneyService_v2 {
  getServiceJourneyMapInfo(
    serviceJourneyId: string,
    query: ServiceJourneyMapInfoQuery
  ): Promise<Result<ServiceJourneyMapInfoData, APIError>>;
  getDeparturesForServiceJourneyV2(
    id: string,
    query: DeparturesForServiceJourneyQuery
  ): Promise<Result<ServiceJourneyEstimatedCallFragment[] | null, APIError>>;
  getServiceJourneyWithEstimatedCallsV2(
    id: string,
    query: ServiceJourneyWithEstimatedCallsQuery
  ): Promise<Result<ServiceJourneyWithEstCallsFragment | null, APIError>>;
}

export interface ITrips_v2 {
  getTrips(query: TripsQueryVariables): Promise<Result<TripsQuery, APIError>>;
  getSingleTrip(
    query: Trips.TripsQueryWithJourneyIds
  ): Promise<Result<Trips.TripPattern, Boom>>;
  getTripPatterns(
    query: TripPatternsQuery
  ): Promise<Result<TripPattern[], APIError>>;
}

export interface IDeparturesGroupedService {
  getDeparturesGrouped(
    location: DepartureGroupsPayload,
    query: DepartureGroupsQuery
  ): Promise<Result<DepartureGroupMetadata, APIError>>;
  getDeparturesFavorites(
    location: DepartureFavoritesPayload,
    query: DepartureFavoritesQuery
  ): Promise<Result<DepartureGroupMetadata, APIError>>;
}

export interface IRealtimeService {
  getDepartureRealtime(
    query: DepartureRealtimeQuery
  ): Promise<Result<DeparturesRealtimeData, APIError>>;
}

export interface IDeparturesService {
  getDepartures(
    query: DeparturesQueryVariables,
    payload: DeparturesPayload
  ): Promise<Result<DeparturesQuery, APIError>>;
  getStopPlacesByPosition(
    query: NearestStopPlacesQueryVariables
  ): Promise<Result<NearestStopPlacesQuery, APIError>>;
  getStopsDetails(
    query: StopsDetailsQueryVariables
  ): Promise<Result<StopsDetailsQuery, APIError>>;
  getStopQuayDepartures(
    query: StopPlaceQuayDeparturesQueryVariables,
    payload?: DeparturesPayload
  ): Promise<Result<StopPlaceQuayDeparturesQuery, APIError>>;
}

export interface IQuayService {
  getQuaysCoordinates(
    payload: QuaysCoordinatesPayload
  ): Promise<Result<GetQuaysCoordinatesQuery, APIError>>;
}

export interface IEnrollmentService {
  enroll(
    customerAccountId: string,
    enrollmentId: string,
    code: string
  ): Promise<Result<EnrollResponse, APIError>>;
}

export interface IVehiclesService {
  getServiceJourneyVehicles(
    query: ServiceJourneyVehicleQueryVariables
  ): Promise<Result<ServiceJourneyVehicles, APIError>>;
}

export interface IMobilityService {
  getVehicles(
    query: VehiclesQuery
  ): Promise<Result<GetVehiclesQuery, APIError>>;
  getStations(
    query: StationsQuery
  ): Promise<Result<GetStationsQuery, APIError>>;
}
