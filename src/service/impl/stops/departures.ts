import client from '../graphql-client';
import { operations } from './departures-from-stops.graphql';
import {
  EstimatedCall,
  StopPlaceDetails,
  Quay,
  Situation,
  ServiceJourney,
  convertPositionToBbox,
  Coordinates
} from '@entur/sdk';
import {
  DeparturesWithStop,
  APIError,
  DeparturesMetadata,
  DeparturesFromLocationQuery
} from '../../types';
import { Result } from '@badrap/result';
import paginate from '../../pagination';
import sortBy from 'lodash.sortby';
import haversineDistance from 'haversine-distance';

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
  options: DeparturesFromLocationQuery
): Promise<Result<DeparturesMetadata, APIError>> {
  const bbox = convertPositionToBbox(coordinates, distance);

  const variables = {
    ...bbox,
    includeCancelledTrips: true,
    omitNonBoarding: !options.includeNonBoarding,
    timeRange: 72000,
    limit: options.limit
  };

  const result = await client.query<{
    stopPlacesByBbox: StopPlaceDetailsWithEstimatedCalls[];
  }>({
    query: operations.ByBBox,
    variables
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  try {
    const data = sortAndFilterStops(
      result.data.stopPlacesByBbox.map(mapToDeparturesWithStop),
      coordinates
    );

    return Result.ok(
      paginate(
        data,
        {
          pageOffset: options.pageOffset,
          pageSize: options.pageSize
        },
        sortQuays
      )
    );
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

export async function getDeparturesFromStops(
  id: string,
  options: DeparturesFromLocationQuery
): Promise<Result<DeparturesMetadata, APIError>> {
  const result = await client.query<{
    stopPlaces: StopPlaceDetailsWithEstimatedCalls[];
  }>({
    query: operations.ById,
    variables: {
      ids: [id],
      includeCancelledTrips: true,
      omitNonBoarding: !options.includeNonBoarding,
      timeRange: 72000,
      limit: options.limit
    }
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  const data = result.data.stopPlaces.map(mapToDeparturesWithStop);
  try {
    return Result.ok(
      paginate(data, {
        pageOffset: options.pageOffset,
        pageSize: options.pageSize
      })
    );
  } catch (error) {
    return Result.err(new APIError(error));
  }
}

function sortAndFilterStops(
  unsortedObject: DeparturesWithStop[],
  location?: Coordinates
): DeparturesWithStop[] {
  let distanceTo = (a: DeparturesWithStop) =>
    location
      ? haversineDistance(location, {
          lat: a.stop.latitude,
          lon: a.stop.longitude
        })
      : 0;
  return sortBy(
    unsortedObject.filter(stop => Object.values(stop.quays).length > 0),
    distanceTo
  );
}

function sortQuays(departures: DeparturesWithStop[]): DeparturesWithStop[] {
  return departures.map(dep => {
    const sortedQuays = sortBy(Object.values(dep.quays), item => item.quay.id);
    let sorted: DeparturesWithStop['quays'] = {};
    for (let quays of sortedQuays) {
      sorted[quays.quay.id] = quays;
    }

    return {
      ...dep,
      quays: sorted
    };
  });
}

const mapToQuayObject = (
  quays?: EstimatedQuay[]
): DeparturesWithStop['quays'] => {
  if (!quays) return {};
  let obj: DeparturesWithStop['quays'] = {};
  for (let item of quays) {
    const { estimatedCalls, ...quay } = item;
    obj[item.id] = {
      quay,
      departures: estimatedCalls
    };
  }
  return obj;
};

const mapToDeparturesWithStop = ({
  quays,
  ...stop
}: StopPlaceDetailsWithEstimatedCalls): DeparturesWithStop => ({
  stop,
  quays: mapToQuayObject(quays)
});
