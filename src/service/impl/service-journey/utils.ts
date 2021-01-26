import { Coordinates } from '@entur/sdk';
import polyline from '@mapbox/polyline';
import haversineDistance from 'haversine-distance';
import { MapLeg, ServiceJourneyMapInfoData } from '../../types';
import { MapInfoByServiceJourneyIdQuery } from './service-journey-map.graphql-gen';

type PolylinePair = [lat: number, lng: number];

const COORDINATE_DISTANCE_THRESHOLD_IN_METERS = 3;

export function mapToMapLegs(
  data: MapInfoByServiceJourneyIdQuery
): ServiceJourneyMapInfoData {
  const baseItem = {
    mode: data.serviceJourney?.line.transportMode,
    transportSubmode: data.serviceJourney?.line.transportSubmode
  };
  const quayCoordinates: PolylinePair = [
    data.quay?.latitude ?? 0,
    data.quay?.longitude ?? 0
  ];

  const coordinates: PolylinePair[] = polyline.decode(
    data.serviceJourney?.pointsOnLink?.points ?? ''
  );

  const splitIndex = coordinates.findIndex(
    c =>
      haversineDistance(c, quayCoordinates) <=
      COORDINATE_DISTANCE_THRESHOLD_IN_METERS
  );

  let mapLegs: MapLeg[] = [];
  if (splitIndex >= 0) {
    const first = coordinates.slice(0, splitIndex);
    const second = coordinates.slice(splitIndex);
    mapLegs = [
      {
        ...baseItem,
        faded: true,
        pointsOnLink: {
          length: first.length,
          points: polyline.encode(first)
        }
      },
      {
        ...baseItem,
        faded: false,
        pointsOnLink: {
          length: second.length,
          points: polyline.encode(second)
        }
      }
    ];
  } else {
    mapLegs = [
      {
        ...baseItem,
        faded: false,
        pointsOnLink: {
          length: coordinates.length,
          points: polyline.encode(coordinates)
        }
      }
    ];
  }

  return {
    start: polypairToCoordinates(coordinates[0]),
    stop: polypairToCoordinates(coordinates[coordinates.length - 1]),
    mapLegs
  };
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
