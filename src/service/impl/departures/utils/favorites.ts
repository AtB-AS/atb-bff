import { EstimatedCall } from '../../../../graphql/journeyplanner-types_v3';
import { FavoriteDeparture } from '../../../types';
import { StopPlaceQuayDeparturesQuery } from '../gql/jp3/stop-departures.graphql-gen';

/**
 * Takes one or more StopPlaces containing departures within one or more Quays
 * and favorites (stopId, lineName, lineId, quayId) and returns the StopPlaces
 * with just favorite departures, or with all departures if no favorites where
 * provided.
 *
 * @param stopPlaces
 * @param favorites
 * @returns
 */
export default function filterFavorites(
  result?: StopPlaceQuayDeparturesQuery,
  favorites?: FavoriteDeparture[]
): StopPlaceQuayDeparturesQuery {
  const stopPlace = result?.stopPlace;
  if (!stopPlace) return {};

  /**
   * Check if a line is a favorite (same lineName, lineId, stopId and quayId as
   * a favorite) OR, if favorites are not provided (user has not filtered on
   * favorites).
   */
  const isFavorite = (item: EstimatedCall) =>
    !favorites ||
    favorites.some(
      f =>
        (!f.lineName || item.destinationDisplay?.frontText === f.lineName) &&
        item.serviceJourney?.line.id === f.lineId &&
        stopPlace.id === f.stopId &&
        (!f.quayId || item.quay?.id === f.quayId)
    );

  const filteredQuays = stopPlace.quays?.map(quay => {
    return {
      ...quay,
      estimatedCalls: quay.estimatedCalls.filter(estimatedCall =>
        isFavorite(estimatedCall as EstimatedCall)
      )
    };
  });

  return {
    ...result,
    stopPlace: {
      ...stopPlace,
      quays: filteredQuays
    }
  };
}
