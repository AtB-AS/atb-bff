import {uniqueStopPlacesById} from '../utils';

describe('uniqueStopPlacesById', () => {
  it('keeps the first stop place per id, in order', () => {
    const stopPlaces = [
      {id: 'NSR:StopPlace:1', name: 'A'},
      {id: 'NSR:StopPlace:2', name: 'B'},
      {id: 'NSR:StopPlace:1', name: 'A again'},
      {id: 'NSR:StopPlace:3', name: 'C'},
      {id: 'NSR:StopPlace:2', name: 'B again'},
    ];
    expect(uniqueStopPlacesById(stopPlaces)).toEqual([
      {id: 'NSR:StopPlace:1', name: 'A'},
      {id: 'NSR:StopPlace:2', name: 'B'},
      {id: 'NSR:StopPlace:3', name: 'C'},
    ]);
  });

  it('returns an empty array for no stop places', () => {
    expect(uniqueStopPlacesById([])).toEqual([]);
  });
});
