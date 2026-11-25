import {VehicleFragment} from '../../fragments/vehicles-gql/vehicle.graphql-gen';
import {createStaleVehicleUpdateFilter} from '../utils';

const update = (lastUpdated?: string, bearing?: number): VehicleFragment => ({
  serviceJourney: {id: 'ATB:ServiceJourney:1'},
  lastUpdated,
  bearing,
});

describe('Function createStaleVehicleUpdateFilter', () => {
  it('accepts the first update', () => {
    const filter = createStaleVehicleUpdateFilter();
    const first = update('2026-11-25T12:00:00Z');
    expect(filter([first])).toBe(first);
  });

  it('accepts updates that are newer than the newest one seen', () => {
    const filter = createStaleVehicleUpdateFilter();
    filter([update('2026-11-25T12:00:00Z')]);
    const newer = update('2026-11-25T12:00:01Z');
    expect(filter([newer])).toBe(newer);
  });

  it('discards updates that are older than the newest one seen', () => {
    const filter = createStaleVehicleUpdateFilter();
    filter([update('2026-11-25T12:00:05Z')]);
    expect(filter([update('2026-11-25T12:00:04Z')])).toBeUndefined();
  });

  it('keeps comparing against the newest update after discarding one', () => {
    const filter = createStaleVehicleUpdateFilter();
    filter([update('2026-11-25T12:00:05Z')]);
    filter([update('2026-11-25T12:00:01Z')]);
    expect(filter([update('2026-11-25T12:00:03Z')])).toBeUndefined();
    const newer = update('2026-11-25T12:00:06Z');
    expect(filter([newer])).toBe(newer);
  });

  it('accepts updates with the same timestamp as the newest one seen', () => {
    const filter = createStaleVehicleUpdateFilter();
    filter([update('2026-11-25T12:00:00Z')]);
    const same = update('2026-11-25T12:00:00Z');
    expect(filter([same])).toBe(same);
  });

  it('compares timestamps across time zone offsets', () => {
    const filter = createStaleVehicleUpdateFilter();
    filter([update('2026-11-25T13:00:05+01:00')]);
    expect(filter([update('2026-11-25T12:00:04Z')])).toBeUndefined();
    const newer = update('2026-11-25T12:00:06Z');
    expect(filter([newer])).toBe(newer);
  });

  it('picks the newest update when a message has several', () => {
    const filter = createStaleVehicleUpdateFilter();
    const newest = update('2026-11-25T12:00:02Z');
    expect(
      filter([
        update('2026-11-25T12:00:01Z'),
        newest,
        update('2026-11-25T12:00:00Z'),
      ]),
    ).toBe(newest);
    expect(filter([update('2026-11-25T12:00:01Z')])).toBeUndefined();
  });

  it('returns undefined for an empty message', () => {
    const filter = createStaleVehicleUpdateFilter();
    expect(filter([])).toBeUndefined();
  });

  it('accepts updates without a valid lastUpdated until a valid one is seen', () => {
    const filter = createStaleVehicleUpdateFilter();
    const missing = update(undefined);
    const invalid = update('not a date');
    expect(filter([missing])).toBe(missing);
    expect(filter([invalid])).toBe(invalid);
    const valid = update('2026-11-25T12:00:05Z');
    expect(filter([valid])).toBe(valid);
  });

  it('discards updates without a valid lastUpdated after a valid one is seen', () => {
    const filter = createStaleVehicleUpdateFilter();
    filter([update('2026-11-25T12:00:05Z')]);
    expect(filter([update(undefined)])).toBeUndefined();
    expect(filter([update('not a date')])).toBeUndefined();
    // Does not reset the newest timestamp seen
    expect(filter([update('2026-11-25T12:00:04Z')])).toBeUndefined();
  });

  it('prefers updates with a valid lastUpdated within a message', () => {
    const filter = createStaleVehicleUpdateFilter();
    const valid = update('2026-11-25T12:00:00Z');
    expect(filter([update(undefined), valid])).toBe(valid);
  });

  it('keeps separate state per filter', () => {
    const filterA = createStaleVehicleUpdateFilter();
    const filterB = createStaleVehicleUpdateFilter();
    filterA([update('2026-11-25T12:00:05Z')]);
    const older = update('2026-11-25T12:00:04Z');
    expect(filterB([older])).toBe(older);
  });
});
