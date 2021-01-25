import polyline from '@mapbox/polyline';
import haversineDistance from 'haversine-distance';
import { MapLegs } from '../../types';
import { MapInfoByServiceJourneyIdQuery } from './service-journey-map.graphql-gen';

type PolylinePair = [lat: number, lng: number];

const COORDINATE_DISTANCE_THRESHOLD_IN_METERS = 20;

export function mapToMapLegs(data: MapInfoByServiceJourneyIdQuery): MapLegs {
  const item: MapLegs = {
    mode: data.serviceJourney?.line.transportMode,
    transportSubmode: data.serviceJourney?.line.transportSubmode,
    legsPolylines: []
  };
  const quayCoordinates: PolylinePair = [
    data.quay?.latitude ?? 0,
    data.quay?.longitude ?? 0
  ];

  const coordinates: PolylinePair[] = polyline.decode(
    data.serviceJourney?.pointsOnLink?.points ?? ''
  );

  const splitIndex = coordinates.findIndex(c =>
    arrayEquals(c, quayCoordinates)
  );

  if (splitIndex) {
    return {
      ...item,
      legsPolylines: [
        polyline.encode(coordinates.slice(0, splitIndex)),
        polyline.encode(coordinates.slice(splitIndex))
      ]
    };
  }

  let legsPolylines = [];
  let current: PolylinePair[] = [];
  for (let coords of coordinates) {
    if (
      haversineDistance(coords, quayCoordinates) <=
      COORDINATE_DISTANCE_THRESHOLD_IN_METERS
    ) {
      legsPolylines.push(polyline.encode(current));
      current = [coords];
    } else {
      current.push(coords);
    }
  }
  legsPolylines.push(polyline.encode(current));
  return { ...item, legsPolylines };
}

function arrayEquals<T>(a: T[], b: T[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}
