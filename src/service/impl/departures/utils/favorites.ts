import { EstimatedCall } from '../../../../graphql/journeyplanner-types_v3';
import { FavoriteDeparture } from '../../../types';
import { StopPlaceQuayDeparturesQuery } from '../gql/jp3/stop-departures.graphql-gen';

export default function filterFavorites(
  result?: StopPlaceQuayDeparturesQuery,
  favorites?: FavoriteDeparture[],
  limit?: number
): StopPlaceQuayDeparturesQuery {
  const stopPlace = result?.stopPlace;
  if (!stopPlace) return {};

  /**
   * Returns whether a departure is a favorite, but if no favorites are
   * provided, returns true.
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
      estimatedCalls: quay.estimatedCalls
        .filter(estimatedCall => isFavorite(estimatedCall as EstimatedCall))
        .slice(0, limit)
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
