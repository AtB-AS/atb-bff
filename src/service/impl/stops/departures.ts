import client from '../graphql-client';
import { operations } from './departuresFromStops.graphql';
import {
  EstimatedCall,
  StopPlaceDetails,
  Quay,
  Situation,
  ServiceJourney,
  convertPositionToBbox,
  Coordinates
} from '@entur/sdk';

export type ServiceJourneyWithDirection = ServiceJourney & {
  directionType: 'inbound' | 'outbound' | 'clockwise' | 'anticlockwise';
};

export type EstimatedCallWithDirection = EstimatedCall & {
  serviceJourney: ServiceJourneyWithDirection;
};

export type EstimatedQuay = Quay & { situations?: Situation[] } & {
  estimatedCalls: EstimatedCallWithDirection[];
};

export type StopPlaceDetailsWithEstimatedCalls = StopPlaceDetails & {
  quays?: EstimatedQuay[];
};

export type StopDepartures = {
  stopPlaces: StopPlaceDetailsWithEstimatedCalls[];
};

export async function getDeparturesFromLocation(
  coordinates: Coordinates,
  distance: number = 500,
  limit: number = 5
): Promise<StopPlaceDetailsWithEstimatedCalls[]> {
  const bbox = convertPositionToBbox(coordinates, distance);

  const variables = {
    ...bbox,
    includeCancelledTrips: true,
    omitNonBoarding: true,
    timeRange: 72000,
    limit
  };

  const result = await client.query<{
    stopPlacesByBbox: StopPlaceDetailsWithEstimatedCalls[];
  }>({
    query: operations.ByBBox,
    variables
  });

  return result.data.stopPlacesByBbox;
}

export async function getDeparturesFromStops(
  id: string,
  limit: number = 5
): Promise<StopPlaceDetailsWithEstimatedCalls[]> {
  const result = await client.query<{
    stopPlaces: StopPlaceDetailsWithEstimatedCalls[];
  }>({
    query: operations.ById,
    variables: {
      ids: [id],
      includeCancelledTrips: true,
      omitNonBoarding: true,
      timeRange: 72000,
      limit
    }
  });
  return result.data.stopPlaces;
}
