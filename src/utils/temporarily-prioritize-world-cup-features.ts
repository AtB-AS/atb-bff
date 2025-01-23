import {Feature, Point} from 'geojson';
import {Location} from '../types/geocoder';

export function temporarilyPrioritizeWorldCupFeatures(
  features: Feature<Point, Location>[],
) {
  const granaasenIdrettsparkId = 'NSR:StopPlace:44095';
  const featuresWithIdrettsparkFirst = moveFeatureToFront(
    features,
    granaasenIdrettsparkId,
  );

  const granaasenSkistadionId = 'OSM:TopographicPlace:8588322';
  const featuresWithSkistadionFirst = moveFeatureToFront(
    featuresWithIdrettsparkFirst,
    granaasenSkistadionId,
  );
  return featuresWithSkistadionFirst;
}

function moveFeatureToFront(
  features: Feature<Point, Location>[],
  featureId: string,
): Feature<Point, Location>[] {
  const feature = features.find((f) => f.properties.id === featureId);
  if (!feature) return features;
  return [feature, ...features.filter((f) => f.properties.id !== featureId)];
}
