import {Result} from '@badrap/result';
import {StopPlaces, StopPlacesByModeQuery} from '../../types';
import {APIError} from '../../../utils/api-error';

type StopPlacesResult = Result<StopPlaces, APIError>;

type Entry = {expiresAt: number; result: Promise<StopPlacesResult>};

/**
 * In-memory cache for stop places. Caching like this should only be used for
 * data that does not have much variance or changes often
 */
export const createStopPlacesByModeCache = ({
  ttlMs,
  maxEntries,
  now = Date.now,
}: {
  ttlMs: number;
  maxEntries: number;
  now?: () => number;
}) => {
  const entries = new Map<string, Entry>();

  return {
    get size() {
      return entries.size;
    },

    getOrLoad(
      query: StopPlacesByModeQuery,
      load: () => Promise<StopPlacesResult>,
    ): Promise<StopPlacesResult> {
      if (ttlMs <= 0) return load();

      const key = toKey(query);
      const cached = entries.get(key);
      if (cached && cached.expiresAt > now()) return cached.result;
      if (cached) entries.delete(key);

      const result = load().then(
        (value) => {
          if (value.isErr) dropIfCurrent(key, result);
          return value;
        },
        (error) => {
          dropIfCurrent(key, result);
          throw error;
        },
      );

      entries.set(key, {expiresAt: now() + ttlMs, result});
      while (entries.size > maxEntries) {
        entries.delete(entries.keys().next().value!);
      }
      return result;
    },
  };

  function dropIfCurrent(key: string, result: Promise<StopPlacesResult>) {
    if (entries.get(key)?.result === result) entries.delete(key);
  }
};

const toKey = ({
  authorities,
  transportModes,
  transportSubmodes,
}: StopPlacesByModeQuery) =>
  JSON.stringify([
    [...authorities].sort(),
    [...transportModes].sort(),
    [...(transportSubmodes ?? [])].sort(),
  ]);
