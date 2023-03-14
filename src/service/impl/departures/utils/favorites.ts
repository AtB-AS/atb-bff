import { EstimatedCall } from '../../../../graphql/journey/journeyplanner-types_v3';
import { FavoriteDeparture } from '../../../types';
import { DeparturesQuery } from '../journey-gql/departures.graphql-gen';
import { QuayDeparturesQuery } from '../journey-gql/quay-departures.graphql-gen';
import { StopPlaceQuayDeparturesQuery } from '../journey-gql/stop-departures.graphql-gen';

export function filterFavoriteDepartures(
  result?: DeparturesQuery,
  favorites?: FavoriteDeparture[]
): DeparturesQuery {
  const quays = result?.quays;
  if (!quays) return { quays: [] };

  /**
   * Returns whether a departure is a favorite, but if no favorites are
   * provided, returns true. Ignores the StopPlace ID in favorites, and requires
   * a Quay ID.
   */
  const isFavorite = (item: EstimatedCall) =>
    !favorites ||
    favorites.some(
      f =>
        (!f.lineName || item.destinationDisplay?.frontText === f.lineName) &&
        item.serviceJourney?.line.id === f.lineId &&
        item.quay?.id === f.quayId
    );

  return {
    ...result,
    quays: quays.map(quay => {
      return {
        ...quay,
        estimatedCalls: quay.estimatedCalls.filter(estimatedCall =>
          isFavorite(estimatedCall as EstimatedCall)
        )
      };
    })
  };
}

/**
 * Deprecated. Should be removed together with /bff/v2/departures/stop-departures
 */
export function filterStopPlaceFavorites(
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

/**
 * Deprecated. Should be removed together with /bff/v2/departures/quay-departures
 */
export function filterQuayFavorites(
  result?: QuayDeparturesQuery,
  favorites?: FavoriteDeparture[]
): QuayDeparturesQuery {
  const quay = result?.quay;
  if (!quay) return {};

  /**
   * Returns whether a departure is a favorite, but if no favorites are
   * provided, returns true. Ignores the StopPlace ID in favorites, and requires
   * a Quay ID.
   */
  const isFavorite = (item: EstimatedCall) =>
    !favorites ||
    favorites.some(
      f =>
        (!f.lineName || item.destinationDisplay?.frontText === f.lineName) &&
        item.serviceJourney?.line.id === f.lineId &&
        item.quay?.id === f.quayId
    );

  return {
    ...result,
    quay: {
      ...quay,
      estimatedCalls: quay.estimatedCalls.filter(estimatedCall =>
        isFavorite(estimatedCall as EstimatedCall)
      )
    }
  };
}
