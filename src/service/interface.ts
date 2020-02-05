import { Result } from '@badrap/result';
import {
  Feature,
  StopPlace,
  TripPattern,
  NearestPlace,
  Quay,
  EstimatedCall,
  Departure
} from '@entur/sdk';
import {
  APIError,
  FeaturesQuery,
  ReverseFeaturesQuery,
  StopPlaceQuery,
  DeparturesFromStopPlaceQuery,
  TripQuery,
  TripPatternsQuery,
  NearestPlacesQuery,
  DeparturesForServiceJourneyQuery,
  QuaysForStopPlaceQuery,
  DeparturesFromQuayQuery,
  DeparturesBetweenStopPlacesQuery
} from './types';

export interface IGeocoderService {
  getFeatures(query: FeaturesQuery): Promise<Result<Feature[], APIError>>;
  getFeaturesReverse(
    query: ReverseFeaturesQuery
  ): Promise<Result<Feature[], APIError>>;
}

export interface IStopsService {
  getStopPlace(id: string): Promise<Result<StopPlace | null, APIError>>;
  getDeparturesBetweenStopPlaces(
    query: DeparturesBetweenStopPlacesQuery
  ): Promise<Result<EstimatedCall[], APIError>>;
  getStopPlacesByPosition(
    query: StopPlaceQuery
  ): Promise<Result<StopPlace[], APIError>>;
  getDeparturesForServiceJourney(
    id: string,
    query: DeparturesForServiceJourneyQuery
  ): Promise<Result<EstimatedCall[] | null, APIError>>;
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

export interface IJourneyService {
  getTrips(query: TripQuery): Promise<Result<TripPattern[], APIError>>;
  getTripPatterns(
    query: TripPatternsQuery
  ): Promise<Result<TripPattern[], APIError>>;
}
