import polyline from '@mapbox/polyline';
import haversineDistance from 'haversine-distance';
import { PointsOnLink } from '../../../graphql/journey/journeyplanner-types_v3';
import { Coordinates, MapLeg, ServiceJourneyMapInfoData } from '../../types';
import {
  MapInfoWithFromAndToQuayV2Query,
  MapInfoWithFromQuayV2Query
} from './journey-gql/service-journey-map.graphql-gen';

type PolylinePair = [lat: number, lng: number];

export function mapToMapLegs(
  data: MapInfoWithFromQuayV2Query & MapInfoWithFromAndToQuayV2Query
): ServiceJourneyMapInfoData {
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
      } as MapLeg
    ]
  };

  if (!fromQuayCoordinates && !toQuayCoordinates) {
    return defaultValue;
  }

  const splitIndexTo = findIndex(coordinates, toQuayCoordinates);
  const splitIndexFrom = findIndex(coordinates, fromQuayCoordinates);

  if (splitIndexFrom < 0 && splitIndexTo < 0) {
    return defaultValue;
  }
  const isNoneOrFirst = splitIndexFrom < 1;
  const isNoneOrLast =
    splitIndexTo < 0 || splitIndexTo >= coordinates.length - 1;

  // before should also include quay.
  const before = isNoneOrFirst ? [] : coordinates.slice(0, splitIndexFrom + 1);
  const mainLeg = coordinates.slice(
    isNoneOrFirst ? 0 : splitIndexFrom,
    isNoneOrLast ? coordinates.length : splitIndexTo + 1
  );
  const after = isNoneOrLast ? [] : coordinates.slice(splitIndexTo);

  const itemIfDefined = (
    item: PolylinePair[],
    faded: boolean
  ): MapLeg | undefined =>
    item.length
      ? ({
          ...baseItem,
          faded,
          pointsOnLink: {
            length: item.length,
            points: polyline.encode(item)
          }
        } as MapLeg)
      : undefined;
  const mapLegs: MapLeg[] = [
    itemIfDefined(before, true),
    itemIfDefined(mainLeg, false),
    itemIfDefined(after, true)
  ].filter(Boolean) as MapLeg[];

  return {
    ...defaultValue,
    mapLegs
  };
}

function findIndex<T>(
  array: Array<PolylinePair>,
  quayCoords?: PolylinePair
): number {
  if (!quayCoords) return -1;
  let closestIndex = -1;
  let closestDistance = 100;
  array.forEach((t, index) => {
    if (haversineDistance(t, quayCoords) < closestDistance) {
      closestIndex = index;
      closestDistance = haversineDistance(t, quayCoords);
    }
  });
  return closestIndex;
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
