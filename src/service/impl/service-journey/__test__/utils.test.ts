import polyline from '@mapbox/polyline';
import { TransportMode, TransportSubmode } from '../../../../graphql/types';
import { mapToMapLegs } from '../utils';

const exampleQuay: [number, number] = [63.37024, 10.37406];
const fixtureLines: [number, number][] = [
  [63.36887, 10.34514],
  [63.37058, 10.35666],
  [63.37045, 10.37156],
  [63.37034, 10.37324],
  exampleQuay,
  [63.37021, 10.37463],
  [63.37018, 10.37563],
  [63.37032, 10.37989],
  [63.37037, 10.38039],
  [63.37044, 10.38093],
  [63.37056, 10.38154]
];

describe('mapToMapLegs', () => {
  it('should split fromQuay when quay location is the same', async () => {
    const result = mapToMapLegs({
      serviceJourney: {
        pointsOnLink: {
          length: fixtureLines.length,
          points: polyline.encode(fixtureLines)
        },
        line: {
          transportMode: TransportMode.Bus,
          transportSubmode: TransportSubmode.LocalBus
        }
      },
      fromQuay: { latitude: exampleQuay[0], longitude: exampleQuay[1] }
    });

    expect(result.mapLegs.length).toEqual(2);

    expect(result.mapLegs[0].faded).toEqual(true);
    expect(result.mapLegs[0].pointsOnLink.length).toEqual(5);

    expect(result.mapLegs[1].faded).toEqual(true);
    // Splitted should include the same quay as end of previous array.
    expect(result.mapLegs[1].pointsOnLink.length).toEqual(7);
  });
});
