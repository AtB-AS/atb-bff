import {compareAscending} from '../grouping';

const sorted = (values: (string | number | undefined)[]) =>
  values.toSorted(compareAscending);

describe('compareAscending', () => {
  it('orders numbers ascending', () => {
    expect(sorted([10, 2, 1])).toEqual([1, 2, 10]);
  });

  it('orders strings ascending', () => {
    expect(sorted(['c', 'a', 'b'])).toEqual(['a', 'b', 'c']);
  });

  it('sorts undefined last', () => {
    expect(sorted([undefined, 2, undefined, 1])).toEqual([
      1,
      2,
      undefined,
      undefined,
    ]);
  });

  it('treats equal values as equal', () => {
    expect(compareAscending(1, 1)).toBe(0);
    expect(compareAscending(undefined, undefined)).toBe(0);
    expect(compareAscending('', '')).toBe(0);
  });

  it('keeps the original order for values that are not mutually comparable', () => {
    // A number against a non-numeric string compares equal, as it did with
    // lodash.sortBy, so the stable sort leaves them where they were.
    expect(compareAscending(1, 'a')).toBe(0);
    expect(sorted(['a', 1, 'b'])).toEqual(['a', 1, 'b']);
  });

  it('sorts an empty string before numbers, as lodash did', () => {
    expect(compareAscending('', 1)).toBe(-1);
  });
});
