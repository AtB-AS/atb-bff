import {Result} from '@badrap/result';
import {createStopPlacesByModeCache} from '../stop-places-by-mode-cache';
import {APIError} from '../../../../utils/api-error';
import {StopPlacesByModeQuery} from '../../../types';
import {
  TransportMode,
  TransportSubmode,
} from '../../../../graphql/journey/journeyplanner-types_v3';

const busQuery: StopPlacesByModeQuery = {
  authorities: ['TRO:Authority:1'],
  transportModes: [TransportMode.Bus],
  transportSubmodes: [TransportSubmode.LocalBus],
};
const waterQuery: StopPlacesByModeQuery = {
  authorities: ['TRO:Authority:1'],
  transportModes: [TransportMode.Water],
};
const stopPlaces = [{id: 'NSR:StopPlace:1', name: 'A'}];

const setup = (ttlMs = 1000, maxEntries = 10) => {
  let time = 0;
  const cache = createStopPlacesByModeCache({
    ttlMs,
    maxEntries,
    now: () => time,
  });
  const load = jest.fn(async () => Result.ok(stopPlaces));
  return {cache, load, advance: (ms: number) => (time += ms)};
};

describe('createStopPlacesByModeCache', () => {
  it('serves repeated queries from the cache until the TTL expires', async () => {
    const {cache, load, advance} = setup(1000);

    await cache.getOrLoad(busQuery, load);
    advance(999);
    const cached = await cache.getOrLoad(busQuery, load);
    expect(load).toHaveBeenCalledTimes(1);
    expect(cached.unwrap()).toBe(stopPlaces);

    advance(1);
    await cache.getOrLoad(busQuery, load);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('keys on the query, ignoring the order of values', async () => {
    const {cache, load} = setup();

    await cache.getOrLoad(
      {...busQuery, transportModes: [TransportMode.Bus, TransportMode.Tram]},
      load,
    );
    await cache.getOrLoad(
      {...busQuery, transportModes: [TransportMode.Tram, TransportMode.Bus]},
      load,
    );
    expect(load).toHaveBeenCalledTimes(1);

    await cache.getOrLoad(waterQuery, load);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('shares one load between concurrent misses', async () => {
    const {cache, load} = setup();

    await Promise.all([
      cache.getOrLoad(busQuery, load),
      cache.getOrLoad(busQuery, load),
      cache.getOrLoad(busQuery, load),
    ]);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('does not cache error results', async () => {
    const {cache} = setup();
    const failing = jest.fn(async () =>
      Result.err<APIError>(new APIError('entur down')),
    );

    expect((await cache.getOrLoad(busQuery, failing)).isErr).toBe(true);
    await cache.getOrLoad(busQuery, failing);
    expect(failing).toHaveBeenCalledTimes(2);
    expect(cache.size).toBe(0);
  });

  it('does not cache rejected loads', async () => {
    const {cache, load} = setup();
    const rejecting = jest.fn(async () => {
      throw new Error('network');
    });

    await expect(cache.getOrLoad(busQuery, rejecting)).rejects.toThrow(
      'network',
    );
    await cache.getOrLoad(busQuery, load);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('evicts the oldest entry beyond maxEntries', async () => {
    const {cache, load} = setup(1000, 2);
    const query = (authority: string) => ({
      ...busQuery,
      authorities: [authority],
    });

    await cache.getOrLoad(query('A'), load);
    await cache.getOrLoad(query('B'), load);
    await cache.getOrLoad(query('C'), load);
    expect(cache.size).toBe(2);

    await cache.getOrLoad(query('A'), load);
    expect(load).toHaveBeenCalledTimes(4);
  });

  it('bypasses the cache when the TTL is 0', async () => {
    const {cache, load} = setup(0);

    await cache.getOrLoad(busQuery, load);
    await cache.getOrLoad(busQuery, load);
    expect(load).toHaveBeenCalledTimes(2);
    expect(cache.size).toBe(0);
  });
});
