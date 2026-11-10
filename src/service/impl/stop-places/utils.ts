import {Org} from '../../types';

export const onlyUniques = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

/**
 * Removes duplicate stop places, keeping the first occurrence per `id` in
 * order. Linear: the previous `findIndex` dedupe was O(n²) and cost ~400ms
 * CPU per Troms `stop-places/mode` request (14k quays).
 */
export const uniqueStopPlacesById = <T extends {id: string}>(
  stopPlaces: T[],
): T[] => {
  const seen = new Set<string>();
  return stopPlaces.filter((stopPlace) => {
    if (seen.has(stopPlace.id)) return false;
    seen.add(stopPlace.id);
    return true;
  });
};

export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

export const orgToEnturOrgNoMap: Record<Org, string> = {
  [Org.atb]: '3',
  [Org.fram]: '71',
  [Org.nfk]: '18',
  [Org.troms]: '72',
};
