import {
  DestinationDisplay,
  EstimatedCall,
} from '../../../../graphql/journey/journeyplanner-types_v3';
import {FavoriteDeparture} from '../../../types';

import {DeparturesQuery} from '../journey-gql/departures.graphql-gen';
import {StopPlaceQuayDeparturesQuery} from '../journey-gql/stop-departures.graphql-gen';
import {ensureViaFormat, mapToLegacyLineName} from './converters';

export function filterFavoriteDepartures(
  result?: DeparturesQuery,
  favorites?: FavoriteDeparture[],
): DeparturesQuery {
  const quays = result?.quays;
  if (!quays) return {quays: []};

  /**
   * Returns whether a departure is a favorite, but if no favorites are
   * provided, returns true. Ignores the StopPlace ID in favorites, and requires
   * a Quay ID.
   */
  const isFavorite = (ec: EstimatedCall) =>
    !favorites ||
    favorites.some(
      (f) =>
        favoriteDepartureMatchesEstimatedCall(f, ec) &&
        ec.quay?.id === f.quayId,
    );

  return {
    ...result,
    quays: quays.map((quay) => {
      return {
        ...quay,
        estimatedCalls: quay.estimatedCalls.filter((estimatedCall) =>
          isFavorite(estimatedCall as EstimatedCall),
        ),
      };
    }),
  };
}

/**
 * Deprecated. Should be removed together with /bff/v2/departures/stop-departures
 */
export function filterStopPlaceFavorites(
  result?: StopPlaceQuayDeparturesQuery,
  favorites?: FavoriteDeparture[],
  limit?: number,
): StopPlaceQuayDeparturesQuery {
  const stopPlace = result?.stopPlace;
  if (!stopPlace) return {};

  /**
   * Returns whether a departure is a favorite, but if no favorites are
   * provided, returns true.
   */
  const isFavorite = (ec: EstimatedCall) =>
    !favorites ||
    favorites.some(
      (f) =>
        favoriteDepartureMatchesEstimatedCall(f, ec) &&
        stopPlace.id === f.stopId &&
        (!f.quayId || ec.quay?.id === f.quayId),
    );

  const filteredQuays = stopPlace.quays?.map((quay) => {
    return {
      ...quay,
      estimatedCalls: quay.estimatedCalls
        .filter((estimatedCall) => isFavorite(estimatedCall as EstimatedCall))
        .slice(0, limit),
    };
  });

  return {
    ...result,
    stopPlace: {
      ...stopPlace,
      quays: filteredQuays,
    },
  };
}

function favoriteDepartureMatchesEstimatedCall(
  favoriteDeparture: FavoriteDeparture,
  estimatedCall: EstimatedCall,
) {
  return (
    estimatedCall.serviceJourney?.line.id === favoriteDeparture.lineId &&
    (!favoriteDeparture.destinationDisplay ||
      destinationDisplaysAreMatching(
        favoriteDeparture.destinationDisplay,
        estimatedCall.destinationDisplay,
      )) &&
    (!favoriteDeparture.lineName ||
      favoriteDeparture.lineName ===
        mapToLegacyLineName(estimatedCall.destinationDisplay))
  );
}

/* NB this is the same function as in the app. Keep in sync! */
function destinationDisplaysAreEqual(
  destinationDisplay1: DestinationDisplay | undefined,
  destinationDisplay2: DestinationDisplay | undefined,
) {
  const frontTextIsEqual =
    destinationDisplay1?.frontText === destinationDisplay2?.frontText;
  const viaLengthIsEqual =
    destinationDisplay1?.via?.length === destinationDisplay2?.via?.length;
  if (!frontTextIsEqual || !viaLengthIsEqual) {
    return false;
  }
  return !!(destinationDisplay1?.via || []).every((via1Item) =>
    destinationDisplay2?.via?.includes(via1Item),
  ); // doesn't check for same order in via arrays, but should it?
}

export function destinationDisplaysAreMatching(
  destinationDisplay1: DestinationDisplay | undefined,
  destinationDisplay2: DestinationDisplay | undefined,
) {
  const dd1 = ensureViaFormat(destinationDisplay1);
  const dd2 = ensureViaFormat(destinationDisplay2);

  return destinationDisplaysAreEqual(dd1, dd2);
}
