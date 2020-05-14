import { Result } from '@badrap/result';
import {
  EstimatedCall,
  Feature,
  NearestPlace,
  Quay,
  StopPlace,
  StopPlaceDetails,
  TripPattern,
  DeparturesById
} from '@entur/sdk';
import {
  APIError,
  DeparturesBetweenStopPlacesParams,
  DeparturesBetweenStopPlacesQuery,
  DeparturesForServiceJourneyQuery,
  DeparturesFromQuayQuery,
  DeparturesFromStopPlaceQuery,
  FeaturesQuery,
  NearestPlacesQuery,
  NextDepartureFromCoordinateQuery,
  NextDepartureFromStopQuery,
  QuaysForStopPlaceQuery,
  ReverseFeaturesQuery,
  StopPlaceQuery,
  TripPatternsQuery,
  TripQuery,
  StopPlaceByNameQuery,
  NearestDeparturesQuery,
  DeparturesByIdWithStopName,
  SingleTripPatternQuery,
  TripPatternQuery
} from './types';
import { AgentError } from './impl/agent';

export interface IAgentService {
  getNextDepartureBetweenStops(
    query: NextDepartureFromStopQuery
  ): Promise<Result<string, AgentError>>;
  getNextDepartureFromCoordinate(
    query: NextDepartureFromCoordinateQuery
  ): Promise<Result<string, AgentError>>;
}

export interface IGeocoderService {
  getFeatures(query: FeaturesQuery): Promise<Result<Feature[], APIError>>;

  getFeaturesReverse(
    query: ReverseFeaturesQuery
  ): Promise<Result<Feature[], APIError>>;
}

export interface IStopsService {
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

  getTripPattern(
    query: TripPatternQuery
  ): Promise<Result<TripPattern | null, APIError>>;
  getTripPatterns(
    query: TripPatternsQuery
  ): Promise<Result<TripPattern[], APIError>>;
}
