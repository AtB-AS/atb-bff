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
  ServiceJourneyMapInfoData
} from './types';
import {
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables
} from './impl/departures/gql/jp3/stop-departures.graphql-gen';
import * as Trips from '../types/trips';
import {
  QuayDeparturesQuery,
  QuayDeparturesQueryVariables
} from './impl/departures/gql/jp3/quay-departures.graphql-gen';

export interface IGeocoderService {
  getFeatures(query: FeaturesQuery): Promise<Result<Feature[], APIError>>;

  getFeaturesReverse(
    query: ReverseFeaturesQuery
  ): Promise<Result<Feature[], APIError>>;
}

export interface IServiceJourneyService {
  getServiceJourneyMapInfo(
    serviceJouerneyId: string,
    query: ServiceJourneyMapInfoQuery
  ): Promise<Result<ServiceJourneyMapInfoData, APIError>>;

  getDeparturesForServiceJourney(
    id: string,
    query: DeparturesForServiceJourneyQuery
  ): Promise<Result<EstimatedCall[] | null, APIError>>;
}

export interface ITrips_v3 {
  getTrips(
    query: Trips.TripsQueryVariables
  ): Promise<Result<Trips.TripsQuery, APIError>>;
  getSingleTrip(
    query: Trips.TripsQueryWithJourneyIds
  ): Promise<Result<Trips.TripPattern, APIError>>;
}

export interface IStopsService {
  getDeparturesGrouped(
    location: DepartureGroupsPayload,
    query: DepartureGroupsQuery
  ): Promise<Result<DepartureGroupMetadata, APIError>>;

  getDepartureRealtime(
    query: DepartureRealtimeQuery
  ): Promise<Result<DeparturesRealtimeData, APIError>>;

  // @TODO Deprecate all

  getDepartures(
    location: FeatureLocation,
    query: DeparturesFromLocationQuery
  ): Promise<Result<DeparturesWithStop[], APIError>>;

  getDeparturesPaging(
    location: FeatureLocation,
    query: DeparturesFromLocationPagingQuery
  ): Promise<Result<DeparturesMetadata, APIError>>;

  // @TODO Deprecate all these
  getNearestDepartures(
    query: NearestDeparturesQuery
  ): Promise<Result<EstimatedCall[], APIError>>;
  getStopPlace(id: string): Promise<Result<StopPlaceDetails | null, APIError>>;
  getStopPlacesByName(
    query: StopPlaceByNameQuery
  ): Promise<Result<StopPlaceDetails[], APIError>>;
  getDeparturesBetweenStopPlaces(
    query: DeparturesBetweenStopPlacesQuery,
    params?: DeparturesBetweenStopPlacesParams
  ): Promise<Result<EstimatedCall[], APIError>>;

  getStopPlacesByPosition(
    query: StopPlaceQuery
  ): Promise<Result<StopPlace[], APIError>>;

  getDeparturesFromStopPlace(
    id: string,
    query: DeparturesFromStopPlaceQuery
  ): Promise<Result<EstimatedCall[], APIError>>;

  getDeparturesFromQuay(
    id: string,
    query: DeparturesFromQuayQuery
  ): Promise<Result<EstimatedCall[], APIError>>;

  getQuaysForStopPlace(
    id: string,
    query: QuaysForStopPlaceQuery
  ): Promise<Result<Quay[] | null, APIError>>;

  getNearestPlaces(
    query: NearestPlacesQuery
  ): Promise<Result<NearestPlace[] | null, APIError>>;
}

export interface IDeparturesService {
  getStopQuayDepartures(
    query: StopPlaceQuayDeparturesQueryVariables
  ): Promise<Result<StopPlaceQuayDeparturesQuery, APIError>>;
  getQuayDepartures(
    query: QuayDeparturesQueryVariables
  ): Promise<Result<QuayDeparturesQuery, APIError>>;
  getDepartureRealtime(
    query: DepartureRealtimeQuery
  ): Promise<Result<DeparturesRealtimeData, APIError>>;
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
