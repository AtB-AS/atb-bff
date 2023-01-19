import { Result } from '@badrap/result';
import { Feature, TripPattern } from '@entur/sdk';
import { Boom } from '@hapi/boom';
import * as Trips from '../types/trips';
import {
  QuayDeparturesQuery,
  QuayDeparturesQueryVariables
} from './impl/departures/journey-gql/quay-departures.graphql-gen';
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
import { DepartureGroupMetadata } from './impl/stops/departure-group';
import {
  APIError,
  DepartureFavoritesPayload,
  DepartureFavoritesQuery,
  DepartureGroupsPayload,
  DepartureGroupsQuery,
  DepartureRealtimeQuery,
  DeparturesForServiceJourneyQuery,
  DeparturesRealtimeData,
  FeaturesQuery,
  QuayDeparturesPayload,
  QuaysCoordinatesPayload,
  ReverseFeaturesQuery,
  VehiclesQuery,
  ServiceJourneyMapInfoData_v3,
  ServiceJourneyMapInfoQuery,
  ServiceJourneyWithEstimatedCallsQuery,
  StopPlaceDeparturesPayload,
  TripPatternsQuery
} from './types';
import { GetVehiclesQuery } from './impl/vehicles/mobility-gql/vehicles.graphql-gen';

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
  ): Promise<Result<ServiceJourneyMapInfoData_v3, APIError>>;
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
  getTrips(
    query: Trips.TripsQueryVariables
  ): Promise<Result<Trips.TripsQuery, APIError>>;
  getSingleTrip(
    query: Trips.TripsQueryWithJourneyIds
  ): Promise<Result<Trips.TripPattern, Boom>>;
  getTripPatterns(
    query: TripPatternsQuery
  ): Promise<Result<TripPattern[], APIError>>;
}

export interface IStopsService {
  getDeparturesGrouped(
    location: DepartureGroupsPayload,
    query: DepartureGroupsQuery
  ): Promise<Result<DepartureGroupMetadata, APIError>>;
  getDeparturesFavorites(
    location: DepartureFavoritesPayload,
    query: DepartureFavoritesQuery
  ): Promise<Result<DepartureGroupMetadata, APIError>>;
  getDepartureRealtime(
    query: DepartureRealtimeQuery
  ): Promise<Result<DeparturesRealtimeData, APIError>>;
}

export interface IDeparturesService {
  getStopPlacesByPosition(
    query: NearestStopPlacesQueryVariables
  ): Promise<Result<NearestStopPlacesQuery, APIError>>;
  getStopsDetails(
    query: StopsDetailsQueryVariables
  ): Promise<Result<StopsDetailsQuery, APIError>>;
  getStopQuayDepartures(
    query: StopPlaceQuayDeparturesQueryVariables,
    payload?: StopPlaceDeparturesPayload
  ): Promise<Result<StopPlaceQuayDeparturesQuery, APIError>>;
  getQuayDepartures(
    query: QuayDeparturesQueryVariables,
    payload?: QuayDeparturesPayload
  ): Promise<Result<QuayDeparturesQuery, APIError>>;
  getDepartureRealtime(
    query: DepartureRealtimeQuery
  ): Promise<Result<DeparturesRealtimeData, APIError>>;
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

export interface IMobilityService {
  getVehicles(
    query: VehiclesQuery
  ): Promise<Result<GetVehiclesQuery, APIError>>;
}
