import {filterStopPlaceFavorites, filterFavoriteDepartures} from '../favorites';

const favoriteWithoutLineNameOrDestinationDisplayL26 = [
  {
    id: '977fba47-4cef-469b-8c23-db74ed508ff8',
    lineId: 'SJN:Line:26',
    lineLineNumber: '26',
    lineName: undefined,
    destinationDisplay: undefined,
    lineTransportationMode: 'rail',
    lineTransportationSubMode: 'longDistance',
    quayId: 'NSR:Quay:644',
    quayName: 'Lilleby stasjon',
    quayPublicCode: '1',
    stopId: 'NSR:StopPlace:388',
  },
];
const favoriteWithoutLineNameOrDestinationDisplayL25 = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: undefined,
    destinationDisplay: undefined,
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:71184',
    quayName: 'Prinsens gate',
    quayPublicCode: 'P1',
    stopId: 'NSR:StopPlace:41613',
  },
];
const favoriteWithLineNameL26 = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'SJN:Line:26',
    lineLineNumber: '26',
    lineName: 'Steinkjer',
    destinationDisplay: undefined,
    lineTransportationMode: 'rail',
    lineTransportationSubMode: 'longDistance',
    quayId: 'NSR:Quay:644',
    quayName: 'Lilleby stasjon',
    quayPublicCode: '1',
    stopId: 'NSR:StopPlace:388',
  },
];

const favoriteWithLineNameL25 = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: undefined,
    destinationDisplay: {
      frontText: 'Vikåsen',
      via: ['Singsaker'],
    },
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:71184',
    quayName: 'Prinsens gate',
    quayPublicCode: 'P1',
    stopId: 'NSR:StopPlace:41613',
  },
];

const favoriteWithDestinationDisplayL25 = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: undefined,
    destinationDisplay: {
      frontText: 'Vikåsen',
      via: ['Singsaker'],
    },
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:71184',
    quayName: 'Prinsens gate',
    quayPublicCode: 'P1',
    stopId: 'NSR:StopPlace:41613',
  },
];

const favoriteUnrelatedL26 = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'SJN:Line:26',
    lineLineNumber: '26',
    lineName: 'Steinkjer',
    destinationDisplay: undefined,
    lineTransportationMode: 'rail',
    lineTransportationSubMode: 'longDistance',
    quayId: 'NSR:Quay:999',
    quayName: 'Gokk stasjon',
    quayPublicCode: '1',
    stopId: 'NSR:StopPlace:999',
  },
];

const favoriteUnrelatedL25 = [
  {
    id: '5fcd70f6-1d2a-49d2-8df9-1fc7d37b34be',
    lineId: 'ATB:Line:2_25',
    lineLineNumber: '25',
    lineName: undefined,
    destinationDisplay: {
      frontText: 'Vikåsen',
      via: ['Singsaker'],
    },
    lineTransportationMode: 'bus',
    lineTransportationSubMode: 'localBus',
    quayId: 'NSR:Quay:555555',
    quayName: 'Prinsens gate',
    quayPublicCode: 'P555555',
    stopId: 'NSR:StopPlace:555555',
  },
];

describe('filter favorites from departure queries', () => {
  it('filter quay favorites without line name or destination display', () => {
    const input = require('./fixture-quay-departures.json');
    const expectedOutput = require('./fixture-quay-departures-filtered-26.json');
    expect(
      filterFavoriteDepartures(
        input,
        favoriteWithoutLineNameOrDestinationDisplayL26,
      ),
    ).toMatchObject(expectedOutput);
  });

  it('filter quay favorites without line name or destination display – via', () => {
    const input = require('./fixture-quay-departures-via.json');
    const expectedOutput = require('./fixture-quay-departures-via-filtered-25.json');
    expect(
      filterFavoriteDepartures(
        input,
        favoriteWithoutLineNameOrDestinationDisplayL25,
      ),
    ).toMatchObject(expectedOutput);
  });

  it('filter quay favorites with line name', () => {
    const input = require('./fixture-quay-departures.json');
    const expectedOutput = require('./fixture-quay-departures-filtered-26-steinkjer.json');
    expect(
      filterFavoriteDepartures(input, favoriteWithLineNameL26),
    ).toMatchObject(expectedOutput);
  });

  it('filter quay favorites with line name, but destination display input – migration check', () => {
    const input = require('./fixture-quay-departures-via.json');
    const expectedOutput = require('./fixture-quay-departures-via-filtered-25-vikasen.json');
    expect(
      filterFavoriteDepartures(input, favoriteWithLineNameL25),
    ).toMatchObject(expectedOutput);
  });

  it('filter quay favorites with destination display – via', () => {
    const input = require('./fixture-quay-departures-via.json');
    const expectedOutput = require('./fixture-quay-departures-via-filtered-25-vikasen.json');
    expect(
      filterFavoriteDepartures(input, favoriteWithDestinationDisplayL25),
    ).toMatchObject(expectedOutput);
  });

  it('filter quay favorites with unrelated favorite', () => {
    const input = require('./fixture-quay-departures.json');
    const expectedOutput = require('./fixture-quay-departures-filtered-none.json');
    expect(filterFavoriteDepartures(input, favoriteUnrelatedL26)).toMatchObject(
      expectedOutput,
    );
  });

  it('filter quay favorites with unrelated favorite – via', () => {
    const input = require('./fixture-quay-departures-via.json');
    const expectedOutput = require('./fixture-quay-departures-via-filtered-none.json');
    expect(filterFavoriteDepartures(input, favoriteUnrelatedL25)).toMatchObject(
      expectedOutput,
    );
  });

  it('filter stopPlace favorites without line name', () => {
    const input = require('./fixture-stopplace-departures.json');
    const expectedOutput = require('./fixture-stopplace-departures-filtered-26.json');
    expect(
      filterStopPlaceFavorites(
        input,
        favoriteWithoutLineNameOrDestinationDisplayL26,
      ),
    ).toMatchObject(expectedOutput);
  });

  it('filter stopPlace favorites with line name', () => {
    const input = require('./fixture-stopplace-departures.json');
    const expectedOutput = require('./fixture-stopplace-departures-filtered-26-steinkjer.json');
    expect(
      filterStopPlaceFavorites(input, favoriteWithLineNameL26),
    ).toMatchObject(expectedOutput);
  });

  it('filter stopPlace favorites with unrelated favorite', () => {
    const input = require('./fixture-stopplace-departures.json');
    const expectedOutput = require('./fixture-stopplace-departures-filtered-none.json');
    expect(filterStopPlaceFavorites(input, favoriteUnrelatedL26)).toMatchObject(
      expectedOutput,
    );
  });
});
