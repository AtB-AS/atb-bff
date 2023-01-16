import polyline from '@mapbox/polyline';
import haversineDistance from 'haversine-distance';
import {
  Coordinates,
  MapLeg_v3,
  ServiceJourneyMapInfoData_v3
} from '../../types';
import {
  MapInfoWithFromAndToQuayV2Query,
  MapInfoWithFromQuayV2Query
} from './journey-gql/service-journey-map.graphql-gen';
import { PointsOnLink } from '../../../graphql/journey/journeyplanner-types_v3';

type PolylinePair = [lat: number, lng: number];

const COORDINATE_DISTANCE_THRESHOLD_IN_METERS = 3;

export function mapToMapLegs_v3(
  data: MapInfoWithFromQuayV2Query & MapInfoWithFromAndToQuayV2Query
): ServiceJourneyMapInfoData_v3 {
  const baseItem = {
    mode: data.serviceJourney?.line.transportMode,
    transportSubmode: data.serviceJourney?.line.transportSubmode
  };
  const fromQuayCoordinates: PolylinePair | undefined = data.fromQuay
    ? [data.fromQuay.latitude ?? 0, data.fromQuay.longitude ?? 0]
    : undefined;
  const toQuayCoordinates: PolylinePair | undefined = data.toQuay
    ? [data.toQuay.latitude ?? 0, data.toQuay.longitude ?? 0]
    : undefined;

  const coordinates: PolylinePair[] = polyline.decode(
    data.serviceJourney?.pointsOnLink?.points ?? ''
  );
  const defaultValue = {
    start: polypairToCoordinates(coordinates[0]),
    stop: polypairToCoordinates(coordinates[coordinates.length - 1]),

    mapLegs: [
      {
        ...baseItem,
        faded: false,
        pointsOnLink: data.serviceJourney?.pointsOnLink as PointsOnLink
      } as MapLeg_v3
    ]
  };

  if (!fromQuayCoordinates && !toQuayCoordinates) {
    return defaultValue;
  }

  const splitIndexFrom = findIfDefined(
    'findIndex',
    coordinates,
    fromQuayCoordinates
  );
  const splitIndexTo = findIfDefined(
    'findLastIndex',
    coordinates,
    toQuayCoordinates
  );

  if (splitIndexFrom < 0 && splitIndexTo < 0) {
    return defaultValue;
  }

  // before should also include quay.
  const before =
    splitIndexFrom < 0 ? [] : coordinates.slice(0, splitIndexFrom + 1);
  const mainLeg = coordinates.slice(
    splitIndexFrom < 0 ? 0 : splitIndexFrom,
    splitIndexTo < 0 ? coordinates.length : splitIndexTo + 1
  );
  const after = splitIndexTo < 0 ? [] : coordinates.slice(splitIndexTo);

  const itemIfDefined = (
    item: PolylinePair[],
    faded: boolean
  ): MapLeg_v3 | undefined =>
    item.length
      ? ({
          ...baseItem,
          faded,
          pointsOnLink: {
            length: item.length,
            points: polyline.encode(item)
          }
        } as MapLeg_v3)
      : undefined;
  const mapLegs: MapLeg_v3[] = [
    itemIfDefined(before, true),
    itemIfDefined(mainLeg, false),
    itemIfDefined(after, true)
  ].filter(Boolean) as MapLeg_v3[];

  return {
    ...defaultValue,
    mapLegs
  };
}

function findIfDefined(
  fn: 'findIndex' | 'findLastIndex',
  coordinates: PolylinePair[],
  quayCoords?: PolylinePair
) {
  const func = fn === 'findIndex' ? findIndex : findLastIndex;
  return quayCoords
    ? func<PolylinePair>(
        coordinates,
        c =>
          haversineDistance(c, quayCoords) <=
          COORDINATE_DISTANCE_THRESHOLD_IN_METERS
      )
    : -1;
}

function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}
function findIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  return array.findIndex(predicate);
}

function polypairToCoordinates(
  position?: PolylinePair
): Coordinates | undefined {
  if (!position) return position;
  const [latitude, longitude] = position;
  return {
    latitude,
    longitude
  };
}
