import mapQueryToGroups from '../grouping';

const favorites = [
  {
    stopId: 'NSR:StopPlace:43153',
    //lineName: 'Trondheim S',
    destinationDisplay: {
      frontText: 'Trondheim S',
    },
    lineId: 'ATB:Line:200109141544126_24_200109141539610',
  },
];

describe('service stops -> departure group utils', () => {
  // These aren't great tests ment for development.
  // Mostly to prevent accidental regressions / to enforce contracts
  // to easier track breaking changes.
  it('snapshot - should group data from venue', () => {
    const fixture = require('./fixture-venue-layer.json');
    expect(mapQueryToGroups(fixture)).toMatchSnapshot();
  });

  it('snapshot - should group data from address', () => {
    const fixture = require('./fixture-address-layer.json');
    expect(mapQueryToGroups(fixture)).toMatchSnapshot();
  });

  it('snapshot - should group data from venue with favorites', () => {
    const fixture = require('./fixture-venue-layer-favorites.json');
    expect(mapQueryToGroups(fixture, favorites)).toMatchSnapshot();
  });

  it('snapshot - should group data from venue with favorites with via data', () => {
    const fixture = require('./fixture-venue-layer-favorites-via.json');
    expect(mapQueryToGroups(fixture, favorites)).toMatchSnapshot();
  });

  it('snapshot - should group data from address with favorites', () => {
    const fixture = require('./fixture-address-layer-favorites.json');
    expect(mapQueryToGroups(fixture, favorites)).toMatchSnapshot();
  });
});
