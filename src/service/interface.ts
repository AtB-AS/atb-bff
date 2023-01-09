import { Result } from '@badrap/result';
import {
  EstimatedCall,
  Feature,
  NearestPlace,
  Quay,
  StopPlace,
  StopPlaceDetails,
  TripPattern
} from '@entur/sdk';
import { DepartureGroupMetadata } from './impl/stops/departure-group';
import {
  APIError,
  DeparturesBetweenStopPlacesParams,
  DeparturesBetweenStopPlacesQuery,
  DeparturesForServiceJourneyQuery,
  DeparturesFromQuayQuery,
  DeparturesFromStopPlaceQuery,
  FeaturesQuery,
  NearestPlacesQuery,
  QuaysForStopPlaceQuery,
  ReverseFeaturesQuery,
  StopPlaceQuery,
  TripPatternsQuery,
  TripQuery,
  StopPlaceByNameQuery,
  NearestDeparturesQuery,
  TripPatternQuery,
  FeatureLocation,
  DeparturesWithStop,
  DeparturesFromLocationQuery,
  DeparturesMetadata,
  DeparturesRealtimeData,
  DepartureRealtimeQuery,
  DeparturesFromLocationPagingQuery,
  DepartureGroupsQuery,
  DepartureGroupsPayload,
  ServiceJourneyMapInfoQuery,
  ServiceJourneyMapInfoData,
  ServiceJourneyMapInfoData_v3,
  QuayDeparturesPayload,
  StopPlaceDeparturesPayload,
  DepartureFavoritesPayload,
  DepartureFavoritesQuery,
  QuaysCoordinatesPayload,
  ServiceJourneyWithEstimatedCallsQuery
} from './types';
import {
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables
} from './impl/departures/journey-gql/stop-departures.graphql-gen';
import * as Trips from '../types/trips';
import {
  QuayDeparturesQuery,
  QuayDeparturesQueryVariables
} from './impl/departures/journey-gql/quay-departures.graphql-gen';
import {
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables
} from './impl/departures/journey-gql/stops-nearest.graphql-gen';
import {
  StopsDetailsQuery,
  StopsDetailsQueryVariables
} from './impl/departures/journey-gql/stops-details.graphql-gen';
import { DepartureFavoritesMetadata } from './impl/departure-favorites/departure-group';
import { EnrollResponse } from './impl/enrollment';
import { Boom } from '@hapi/boom';
import { ServiceJourneyEstimatedCallFragment } from './impl/service-journey/journey-gql/service-journey-departures.graphql-gen';
import { GetQuaysCoordinatesQuery } from './impl/quays/journey-gql/quays-coordinates.graphql-gen';
import { ServiceJourneyWithEstCallsFragment } from './impl/fragments/journey-gql/service-journey.graphql-gen';

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
}

export interface IStopsService {
  getDeparturesGrouped(
    location: DepartureGroupsPayload,
    query: DepartureGroupsQuery
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

export interface IDepartureFavoritesService {
  getDeparturesFavorites(
    location: DepartureFavoritesPayload,
    query: DepartureFavoritesQuery
  ): Promise<Result<DepartureFavoritesMetadata, APIError>>;
}

export interface IQuayService {
  getQuaysCoordinates(
    payload: QuaysCoordinatesPayload
  ): Promise<Result<GetQuaysCoordinatesQuery, APIError>>;
}

export interface IJourneyService {
  getTrips(query: TripQuery): Promise<Result<TripPattern[], APIError>>;

  getTripPattern(
    query: TripPatternQuery
  ): Promise<Result<TripPattern | null, APIError>>;
  getTripPatterns(
    query: TripPatternsQuery
  ): Promise<Result<TripPattern[], APIError>>;
}

export interface IEnrollmentService {
  enroll(
    customerAccountId: string,
    enrollmentId: string,
    code: string
  ): Promise<Result<EnrollResponse, APIError>>;
}
