import client from '../../../graphql/graphql-client';
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
  DeparturesFromLocationPagingQuery
} from '../../types';
import { Result } from '@badrap/result';
import paginate from '../../pagination';
import sortBy from 'lodash.sortby';
import haversineDistance from 'haversine-distance';
import { populateCacheIfNotThere } from './departure-time';
import {
  ByBBoxDocument,
  ByBBoxQueryVariables,
  ByBBoxQuery,
  ByIdQuery,
  ByIdDocument,
  ByIdQueryVariables,
  EstimatedCallFieldsFragment
} from './departures-from-stops.graphql-gen';

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
  options: DeparturesFromLocationPagingQuery
): Promise<Result<DeparturesMetadata, APIError>> {
  const bbox = convertPositionToBbox(coordinates, distance);

  const variables = {
    ...bbox,
    timeRange: 86400 * 2, // Two days
    startTime: options.startTime,
    limit: options.limit
  };

  const result = await client.query<ByBBoxQuery, ByBBoxQueryVariables>({
    query: ByBBoxDocument,
    variables,
    // We can cache here as we pass in startTime and use
    // the departure time query to update the time.
    fetchPolicy: 'cache-first'
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  try {
    const data = sortAndFilterStops(
      result.data.stopPlacesByBbox.map(mapToDeparturesWithStop),
      coordinates
    );

    populateRealtimeCache(data, options);

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
  options: DeparturesFromLocationPagingQuery
): Promise<Result<DeparturesMetadata, APIError>> {
  const result = await client.query<ByIdQuery, ByIdQueryVariables>({
    query: ByIdDocument,
    variables: {
      ids: [id],
      timeRange: 86400 * 2, // Two days
      startTime: options.startTime,
      limit: options.limit
    },

    // We can cache here as we pass in startTime and use
    // the departure time query to update the time.
    fetchPolicy: 'cache-first'
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  try {
    const data = result.data.stopPlaces.map(mapToDeparturesWithStop);
    populateRealtimeCache(data, options);

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
  return sortBy(unsortedObject.filter(hasQuaysAndDepartures), distanceTo);
}

function hasQuaysAndDepartures(stop: DeparturesWithStop) {
  const quays = Object.values(stop.quays);
  if (!quays.length) {
    return false;
  }
  if (quays.some(q => q.departures.length > 0)) {
    return true;
  }

  return false;
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

type StopDataInternal = ByIdQuery['stopPlaces'][0];

type QuayDataInternal = NonNullable<StopDataInternal['quays']>[0];

const mapToQuayObject = (
  quays?: QuayDataInternal[]
): DeparturesWithStop['quays'] => {
  if (!quays) return {};
  let obj: DeparturesWithStop['quays'] = {};
  for (let item of quays) {
    const { estimatedCalls, ...quay } = item;
    obj[item.id] = {
      quay: quay as Quay,
      departures: estimatedCalls as EstimatedCall[]
    };
  }
  return obj;
};

const mapToDeparturesWithStop = ({
  quays,
  ...stop
}: StopDataInternal): DeparturesWithStop => ({
  stop: stop as StopPlaceDetails,
  quays: mapToQuayObject(quays)
});

function populateRealtimeCache(
  data: DeparturesWithStop[],
  options: DeparturesFromLocationPagingQuery
) {
  // Take all quays up until latest page, to populate correct cache (what the client) has fetched so far.
  const quayIds = data
    .slice(0, options.pageOffset + options.pageSize)
    .flatMap(stop => Object.keys(stop.quays));

  // Fire and forget, no need to wait for promise
  return populateCacheIfNotThere({
    limit: options.limit,
    startTime: options.startTime,
    quayIds
  });
}
