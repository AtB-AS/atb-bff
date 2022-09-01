import { EstimatedCall } from '../../../../graphql/journeyplanner-types_v3';
import {
  DepartureLineInfo,
  FavouriteCall,
  FavouriteDepartureAPIParam,
  QuayInfo,
  StopPlaceInfo
} from '../../../../types/departures';
import { FavoriteDeparture } from '../../../types';
import {
  FavouriteDepartureDocument,
  FavouriteDepartureQuery
} from '../gql/jp3/favourite-departure.graphql-gen';
import {
  QuayDeparturesDocument,
  QuayDeparturesQuery
} from '../gql/jp3/quay-departures.graphql-gen';
import { StopPlaceQuayDeparturesQuery } from '../gql/jp3/stop-departures.graphql-gen';

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

/**
 * A call is a valid favourite if it either matches the queried linename,
 * or the query has an empty linename
 */
export function callMatchesQueriedLineName(
  call: FavouriteCall,
  query: FavouriteDepartureAPIParam[]
) {
  return query
    .filter(favourite => favourite.lineId == call.serviceJourney?.line.id)
    .some(
      favourite =>
        favourite.lineName === undefined ||
        favourite.lineName === '' ||
        favourite.lineName === call.destinationDisplay?.frontText
    );
}

export function extractStopPlaces(queryResults: FavouriteDepartureQuery[]) {
  const stopPlaceMap: { [key: string]: StopPlaceInfo } = {};
  queryResults
    .map(result => {
      return result.quays.find(quay => quay.stopPlace)
        ?.stopPlace as StopPlaceInfo;
    })
    .filter(stopPlace => {
      return stopPlace !== undefined;
    })
    .forEach(stopPlace => {
      stopPlaceMap[stopPlace.id] = stopPlace;
    });

  return Object.values(stopPlaceMap);
}

export function extractQuays(queryResults: FavouriteDepartureQuery[]) {
  const quayMap: { [key: string]: QuayInfo } = {};
  queryResults
    .map(result => {
      return result.quays.find(quay => quay.id !== undefined);
    })
    .filter(quay => {
      return quay !== undefined;
    })
    .map(quay => {
      return {
        id: quay!.id, // !bang because stoopid TSC
        name: quay!.name,
        stopPlaceId: quay!.stopPlace?.id,
        publicCode: quay?.publicCode,
        latitude: quay?.stopPlace?.latitude,
        longitude: quay?.stopPlace?.longitude,
        situations: []
      } as QuayInfo;
    })
    .forEach(quayInfo => {
      quayMap[quayInfo.id] = quayInfo;
    });
  return Object.values(quayMap);
}
export function extractLineInfos(queryResults: FavouriteDepartureQuery[]) {
  const lineInfoMap: { [key: string]: DepartureLineInfo } = {};

  queryResults.forEach(result =>
    result.quays.forEach(quay => {
      quay.estimatedCalls.forEach(call => {
        const line = call.serviceJourney?.line;
        if (line && call.quay?.id && line.name && line.publicCode) {
          lineInfoMap[getDepartureLineIdentifierfromCall(call)] = {
            lineId: line.id,
            lineName: call.destinationDisplay?.frontText ?? '',
            lineNumber: line.publicCode,
            quayId: call.quay.id,
            notices: [],
            transportMode: line.transportMode,
            transportSubmode: line.transportSubmode
          };
        }
      });
    })
  );

  return Object.values(lineInfoMap);
}

export function getDepartureLineIdentifierfromCall(call: {
  serviceJourney?: { line?: { id: string | undefined } };
  destinationDisplay?: { frontText?: string | undefined };
}) {
  return `${call.serviceJourney?.line?.id ?? ''}-${
    call.destinationDisplay?.frontText ?? ''
  }`;
}
