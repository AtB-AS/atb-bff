import {compareVersion} from '../compare-version';

describe('Function compareVersion', () => {
  const versions: [string, string, number][] = [
    // first version is greater
    ['1.2', '1.1', 1],
    ['1.1.1', '1.1', 1],
    ['1.100.1', '1.1', 1],
    ['1.3.0', '1.2.3', 1],
    ['2.0.3', '1.2.0', 1],
    ['2.1', '1.1.1', 1],
    ['2.3.1', '2.1.2', 1],
    ['2.1.1', '2.0.2', 1],
    ['2.0.0', '1.2.3', 1],
    ['2.1', '1.1', 1],
    // second version is greater
    ['1.4', '1.31', -1],
    ['1.4.1', '1.31.1', -1],
    ['1.1', '1.1.1', -1],
    ['1.1', '2.1', -1],
    ['1.2.3', '1.2.4', -1],
    ['1.2.0', '1.2.1', -1],
    ['1.2.3', '2.0.0', -1],
    // same version
    ['1.2', '1.2.0', 0],
    ['1.2.0', '1.2', 0],
    ['1.1', '1.1', 0],
    ['1', '1', 0],
    // empty strings
    ['', '1.0.0', NaN],
    ['1.2.0', '', NaN],
    ['', '', NaN],
    // edge cases
    ['0.0.0', '0.0.0', 0],
    ['0.0.0', '0.0.1', -1],
    ['0.0.1', '0.0.0', 1],
  ];

  versions.forEach(([versionA, versionB, expected]) => {
    it(`correctly compares ${versionA} and ${versionB}`, () => {
      expect(compareVersion(versionA, versionB)).toBe(expected);
    });
  });
});
