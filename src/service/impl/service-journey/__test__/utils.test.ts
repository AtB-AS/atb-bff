import polyline from '@mapbox/polyline';
import {
  TransportMode,
  TransportSubmode
} from '../../../../graphql/journey/journeyplanner-types_v3';
import { mapToMapLegs } from '../utils';

const exampleQuay: [number, number] = [63.37024, 10.37406];
const exampleEndQuay: [number, number] = [63.37037, 10.38039];
const fixtureLines: [number, number][] = [
  [63.36887, 10.34514],
  [63.37058, 10.35666],
  [63.37045, 10.37156],
  [63.37034, 10.37324],
  exampleQuay,
  [63.37021, 10.37463],
  [63.37018, 10.37563],
  [63.37032, 10.37989],
  exampleEndQuay,
  [63.37044, 10.38093],
  [63.37056, 10.38154]
];

describe('mapToMapLegs', () => {
  const point = (points: string) => polyline.decode(points);
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

    const firstPoints = result.mapLegs[0].pointsOnLink.points;
    const secondPoints = result.mapLegs[1].pointsOnLink.points;
    expect(firstPoints).toBeDefined();
    expect(secondPoints).toBeDefined();

    const first = point(firstPoints as string);
    const second = point(secondPoints as string);
    expect(result.mapLegs[0].faded).toEqual(true);
    expect(result.mapLegs[1].faded).toEqual(false);

    expect(first).toHaveLength(5);
    expect(second).toHaveLength(7);

    // First leg from split should end with quay.
    expect(first[first.length - 1]).toEqual(exampleQuay);
    // Second leg from split should start with quay.
    expect(second[0]).toEqual(exampleQuay);
  });

  it('when splitting on start and end, end leg should include end quay', async () => {
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
      fromQuay: { latitude: exampleQuay[0], longitude: exampleQuay[1] },
      toQuay: { latitude: exampleEndQuay[0], longitude: exampleEndQuay[1] }
    });

    expect(result.mapLegs.length).toEqual(3);

    const firstPoints = result.mapLegs[0].pointsOnLink.points;
    const secondPoints = result.mapLegs[1].pointsOnLink.points;
    const thirdPoints = result.mapLegs[2].pointsOnLink.points;
    expect(firstPoints).toBeDefined();
    expect(secondPoints).toBeDefined();
    expect(thirdPoints).toBeDefined();

    const first = point(firstPoints as string);
    const second = point(secondPoints as string);
    const third = point(thirdPoints as string);
    expect(result.mapLegs[0].faded).toEqual(true);
    expect(result.mapLegs[1].faded).toEqual(false);
    expect(result.mapLegs[2].faded).toEqual(true);

    expect(first).toHaveLength(5);
    expect(second).toHaveLength(5);
    expect(third).toHaveLength(3);

    // First leg from split should end with quay.
    expect(first[first.length - 1]).toEqual(exampleQuay);
    // Second leg from split should start with quay and end with quay
    expect(second[0]).toEqual(exampleQuay);
    expect(second[second.length - 1]).toEqual(exampleEndQuay);

    // Third should also include quay
    expect(third[0]).toEqual(exampleEndQuay);
  });
});
