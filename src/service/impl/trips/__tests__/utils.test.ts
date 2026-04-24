import {Mode} from '../../../../graphql/journey/journeyplanner-types_v3';
import {Leg} from '../../../../types/trips';
import {
  hasTemporalOverlap,
  computeAimedTimes,
  determineTripStatus,
} from '../utils';

function makeTransitLeg(overrides: Partial<Leg> = {}): Leg {
  return {
    mode: Mode.Bus,
    distance: 1000,
    duration: 600,
    aimedStartTime: '2024-01-01T10:00:00.000Z',
    aimedEndTime: '2024-01-01T10:10:00.000Z',
    expectedStartTime: '2024-01-01T10:00:00.000Z',
    expectedEndTime: '2024-01-01T10:10:00.000Z',
    realtime: true,
    situations: [],
    fromPlace: {
      name: 'A',
      longitude: 10,
      latitude: 63,
      quay: {
        id: 'NSR:Quay:1',
        name: 'A',
        situations: [],
        tariffZones: [],
      },
    },
    toPlace: {
      name: 'B',
      longitude: 10.1,
      latitude: 63.1,
      quay: {
        id: 'NSR:Quay:2',
        name: 'B',
        situations: [],
        tariffZones: [],
      },
    },
    intermediateEstimatedCalls: [],
    serviceJourneyEstimatedCalls: [],
    ...overrides,
  } as Leg;
}

function makeFootLeg(overrides: Partial<Leg> = {}): Leg {
  return {
    mode: Mode.Foot,
    distance: 500,
    duration: 300,
    aimedStartTime: '2024-01-01T09:55:00.000Z',
    aimedEndTime: '2024-01-01T10:00:00.000Z',
    expectedStartTime: '2024-01-01T09:55:00.000Z',
    expectedEndTime: '2024-01-01T10:00:00.000Z',
    realtime: false,
    situations: [],
    fromPlace: {name: 'Start', longitude: 10, latitude: 63},
    toPlace: {name: 'Stop', longitude: 10.05, latitude: 63.05},
    intermediateEstimatedCalls: [],
    serviceJourneyEstimatedCalls: [],
    ...overrides,
  } as Leg;
}

describe('hasTemporalOverlap', () => {
  it('returns false when legs are sequential', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
      }),
    ];
    expect(hasTemporalOverlap(legs)).toBe(false);
  });

  it('returns true when legs overlap', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
      }),
    ];
    expect(hasTemporalOverlap(legs)).toBe(true);
  });

  it('returns false for a single leg', () => {
    const legs: Leg[] = [makeTransitLeg()];
    expect(hasTemporalOverlap(legs)).toBe(false);
  });

  it('returns false when legs are exactly adjacent', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:10:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
      }),
    ];
    expect(hasTemporalOverlap(legs)).toBe(false);
  });
});

describe('computeAimedTimes', () => {
  it('returns aimed times from first and last leg when all are transit', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:00:00.000Z',
        aimedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:15:00.000Z',
        aimedEndTime: '2024-01-01T10:25:00.000Z',
      }),
    ];
    const result = computeAimedTimes(legs);
    expect(result.aimedStartTime).toBe('2024-01-01T10:00:00.000Z');
    expect(result.aimedEndTime).toBe('2024-01-01T10:25:00.000Z');
  });

  it('derives aimed start from first transit leg when first leg is foot', () => {
    const footLeg = makeFootLeg({duration: 300});
    const transitLeg = makeTransitLeg({
      aimedStartTime: '2024-01-01T10:00:00.000Z',
      aimedEndTime: '2024-01-01T10:10:00.000Z',
    });
    const result = computeAimedTimes([footLeg, transitLeg]);
    // 10:00 - 300 seconds = 09:55
    expect(result.aimedStartTime).toBe('2024-01-01T09:55:00.000Z');
    expect(result.aimedEndTime).toBe('2024-01-01T10:10:00.000Z');
  });

  it('derives aimed end from last transit leg when last leg is foot', () => {
    const transitLeg = makeTransitLeg({
      aimedStartTime: '2024-01-01T10:00:00.000Z',
      aimedEndTime: '2024-01-01T10:10:00.000Z',
    });
    const footLeg = makeFootLeg({duration: 300});
    const result = computeAimedTimes([transitLeg, footLeg]);
    expect(result.aimedStartTime).toBe('2024-01-01T10:00:00.000Z');
    // 10:10 + 300 seconds = 10:15
    expect(result.aimedEndTime).toBe('2024-01-01T10:15:00.000Z');
  });

  it('returns empty strings when legs array is empty', () => {
    const result = computeAimedTimes([]);
    expect(result.aimedStartTime).toBe('');
    expect(result.aimedEndTime).toBe('');
  });
});

describe('determineTripStatus', () => {
  it('returns valid when legs are sequential', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
      }),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });

  it('returns impossible when legs have temporal overlap', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
      }),
    ];
    expect(determineTripStatus(legs)).toBe('impossible');
  });
});
