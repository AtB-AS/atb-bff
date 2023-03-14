import {
  filterStopPlaceFavorites,
  filterFavoriteDepartures
} from '../favorites';

const favoriteWithoutLineName = [
  {
    id: '977fba47-4cef-469b-8c23-db74ed508ff8',
    lineId: 'SJN:Line:26',
    lineLineNumber: '26',
    lineName: undefined,
    lineTransportationMode: 'rail',
    lineTransportationSubMode: 'longDistance',
    quayId: 'NSR:Quay:644',
    quayName: 'Lilleby stasjon',
    quayPublicCode: '1',
    stopId: 'NSR:StopPlace:388'
  }
];
const favoriteWithLineName = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'SJN:Line:26',
    lineLineNumber: '26',
    lineName: 'Steinkjer',
    lineTransportationMode: 'rail',
    lineTransportationSubMode: 'longDistance',
    quayId: 'NSR:Quay:644',
    quayName: 'Lilleby stasjon',
    quayPublicCode: '1',
    stopId: 'NSR:StopPlace:388'
  }
];

const favoriteUnrelated = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'SJN:Line:26',
    lineLineNumber: '26',
    lineName: 'Steinkjer',
    lineTransportationMode: 'rail',
    lineTransportationSubMode: 'longDistance',
    quayId: 'NSR:Quay:999',
    quayName: 'Gokk stasjon',
    quayPublicCode: '1',
    stopId: 'NSR:StopPlace:999'
  }
];

describe('filter favorites from departure queries', () => {
  it('filter quay favorites without line name', () => {
    const input = require('./fixture-quay-departures.json');
    const expectedOutput = require('./fixture-quay-departures-filtered-26.json');
    expect(
      filterFavoriteDepartures(input, favoriteWithoutLineName)
    ).toMatchObject(expectedOutput);
  });

  it('filter quay favorites with line name', () => {
    const input = require('./fixture-quay-departures.json');
    const expectedOutput = require('./fixture-quay-departures-filtered-26-steinkjer.json');
    expect(filterFavoriteDepartures(input, favoriteWithLineName)).toMatchObject(
      expectedOutput
    );
  });

  it('filter quay favorites with unrelated favorite', () => {
    const input = require('./fixture-quay-departures.json');
    const expectedOutput = require('./fixture-quay-departures-filtered-none.json');
    expect(filterFavoriteDepartures(input, favoriteUnrelated)).toMatchObject(
      expectedOutput
    );
  });

  it('filter stopPlace favorites without line name', () => {
    const input = require('./fixture-stopplace-departures.json');
    const expectedOutput = require('./fixture-stopplace-departures-filtered-26.json');
    expect(
      filterStopPlaceFavorites(input, favoriteWithoutLineName)
    ).toMatchObject(expectedOutput);
  });

  it('filter stopPlace favorites with line name', () => {
    const input = require('./fixture-stopplace-departures.json');
    const expectedOutput = require('./fixture-stopplace-departures-filtered-26-steinkjer.json');
    expect(filterStopPlaceFavorites(input, favoriteWithLineName)).toMatchObject(
      expectedOutput
    );
  });

  it('filter stopPlace favorites with unrelated favorite', () => {
    const input = require('./fixture-stopplace-departures.json');
    const expectedOutput = require('./fixture-stopplace-departures-filtered-none.json');
    expect(filterStopPlaceFavorites(input, favoriteUnrelated)).toMatchObject(
      expectedOutput
    );
  });
});
