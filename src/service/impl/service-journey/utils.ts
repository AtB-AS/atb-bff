import polyline from '@mapbox/polyline';
import haversineDistance from 'haversine-distance';
import {Coordinates, MapLeg, ServiceJourneyMapInfoData} from '../../types';
import {
  MapInfoWithFromAndToQuayV2Query,
  MapInfoWithFromQuayV2Query,
} from './journey-gql/service-journey-map.graphql-gen';

type PolylinePair = [lat: number, lng: number];

export function mapToMapLegs(
  data: MapInfoWithFromQuayV2Query & MapInfoWithFromAndToQuayV2Query,
): ServiceJourneyMapInfoData {
  const baseItem = {
    mode: data.serviceJourney?.line.transportMode,
    transportSubmode: data.serviceJourney?.line.transportSubmode,
  };
  const fromQuayCoordinates: PolylinePair | undefined = data.fromQuay
    ? [data.fromQuay.latitude ?? 0, data.fromQuay.longitude ?? 0]
    : undefined;
  const toQuayCoordinates: PolylinePair | undefined = data.toQuay
    ? [data.toQuay.latitude ?? 0, data.toQuay.longitude ?? 0]
    : undefined;

  const pointsCoords: PolylinePair[] = polyline.decode(
    data.serviceJourney?.pointsOnLink?.points ?? '',
  );

  const mainStartIndex = fromQuayCoordinates
    ? findIndex(pointsCoords, fromQuayCoordinates)
    : 0;
  const mainEndIndex = toQuayCoordinates
    ? findIndex(pointsCoords, toQuayCoordinates)
    : pointsCoords.length - 1;

  const beforeLegCoords = pointsCoords.slice(0, mainStartIndex + 1);
  const mainLegCoords = pointsCoords.slice(mainStartIndex, mainEndIndex + 1);
  const afterLegCoords = pointsCoords.slice(mainEndIndex);

  const toMapLeg = (item: PolylinePair[], faded: boolean): MapLeg =>
    ({
      ...baseItem,
      faded,
      pointsOnLink: {
        length: item.length,
        points: polyline.encode(item),
      },
    }) as MapLeg;

  const mapLegs: MapLeg[] = [
    toMapLeg(beforeLegCoords, true),
    toMapLeg(mainLegCoords, false),
    toMapLeg(afterLegCoords, true),
  ].filter((leg) => (leg.pointsOnLink.length || 0) > 1);

  return {
    start: polypairToCoordinates(pointsCoords[0]),
    stop: polypairToCoordinates(pointsCoords[pointsCoords.length - 1]),
    mapLegs,
  };
}

function findIndex(
  array: Array<PolylinePair>,
  quayCoords: PolylinePair,
): number {
  return array.reduce(
    (closest, t, index) => {
      const distance = haversineDistance(t, quayCoords);
      return distance < closest.distance ? {index, distance} : closest;
    },
    {index: -1, distance: 100},
  ).index;
}

function polypairToCoordinates(
  position?: PolylinePair,
): Coordinates | undefined {
  if (!position) return position;
  const [latitude, longitude] = position;
  return {
    latitude,
    longitude,
  };
}
