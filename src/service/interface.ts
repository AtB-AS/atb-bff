import { Result } from '@badrap/result';
import { Departure, Feature, StopPlace, TripPattern } from '@entur/sdk';
import {
  APIError,
  FeaturesQuery,
  ReverseFeaturesQuery,
  StopPlaceQuery,
  DeparturesFromStopPlaceQuery,
  TripQuery,
  TripPatternsQuery
} from './types';

export interface IGeocoderService {
  getFeatures(query: FeaturesQuery): Promise<Result<Feature[], APIError>>;
  getFeaturesReverse(
    query: ReverseFeaturesQuery
  ): Promise<Result<Feature[], APIError>>;
}

export interface IStopsService {
  getStopPlace(id: string): Promise<Result<StopPlace | null, APIError>>;
  getStopPlacesByPosition(
    query: StopPlaceQuery
  ): Promise<Result<StopPlace[], APIError>>;
  getDeparturesFromStopPlace(
    id: string,
    query: DeparturesFromStopPlaceQuery
  ): Promise<Result<Departure[], APIError>>;
}

export interface IJourneyService {
  getTrips(query: TripQuery): Promise<Result<TripPattern[], APIError>>;
  getTripPatterns(
    query: TripPatternsQuery
  ): Promise<Result<TripPattern[], APIError>>;
}
