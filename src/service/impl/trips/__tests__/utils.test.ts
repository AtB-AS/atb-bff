import {Mode} from '../../../../graphql/journey/journeyplanner-types_v3';
import {Leg} from '../../../../types/trips';
import {
  TransferRisk,
  withTransferRisk,
  getTripTransferRisk,
} from '@atb-as/utils';
import {
  hasTemporalOverlap,
  computeTripAimedStartEnd,
  adjustNonTransitExpectedTimes,
  determineTripStatus,
  generateSingleTripQueryString,
  parseTripQueryString,
} from '../utils';
import {TripPattern} from '../../../../types/trips';
import {TripsQueryVariables} from '../journey-gql/trip.graphql-gen';

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
    serviceJourney: {id: 'ATB:ServiceJourney:test'},
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

describe('hasTemporalOverlap with interchanges', () => {
  it('ignores an overlap at a guaranteed interchange', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true},
      }),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(hasTemporalOverlap(legs)).toBe(false);
  });

  it('returns true when the interchange is explicitly not guaranteed', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: false},
      }),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(hasTemporalOverlap(legs)).toBe(true);
  });

  it('returns true when there is no interchange at all', () => {
    const legs = [
      makeTransitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(hasTemporalOverlap(legs)).toBe(true);
  });

  it('ignores a guaranteed interchange reached through a walk', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true},
      }),
      makeFootLeg({
        expectedStartTime: '2024-01-01T10:10:00.000Z',
        expectedEndTime: '2024-01-01T10:15:00.000Z',
      }),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:13:00.000Z'}),
    ];
    expect(hasTemporalOverlap(legs)).toBe(false);
  });

  it('ignores an overlap within the interchange maximum wait time', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true, maximumWaitTime: 300},
      }),
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:08:00.000Z',
        expectedStartTime: '2024-01-01T10:08:00.000Z',
      }),
    ];
    // Held until 10:08 + 5 min = 10:13, and we arrive at 10:10.
    expect(hasTemporalOverlap(legs)).toBe(false);
  });

  it('treats arrival exactly at the maximum wait deadline as caught', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:13:00.000Z',
        interchangeTo: {guaranteed: true, maximumWaitTime: 300},
      }),
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:08:00.000Z',
        expectedStartTime: '2024-01-01T10:08:00.000Z',
      }),
    ];
    expect(hasTemporalOverlap(legs)).toBe(false);
  });

  it('returns true once arrival is past the maximum wait time', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:20:00.000Z',
        interchangeTo: {guaranteed: true, maximumWaitTime: 300},
      }),
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:08:00.000Z',
        expectedStartTime: '2024-01-01T10:08:00.000Z',
      }),
    ];
    // Held until 10:13, but we do not arrive until 10:20.
    expect(hasTemporalOverlap(legs)).toBe(true);
  });

  it('counts an intervening walk against the maximum wait time', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true, maximumWaitTime: 120},
      }),
      makeFootLeg({
        expectedStartTime: '2024-01-01T10:10:00.000Z',
        expectedEndTime: '2024-01-01T10:15:00.000Z',
      }),
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:11:00.000Z',
        expectedStartTime: '2024-01-01T10:11:00.000Z',
      }),
    ];
    // Held until 10:13, but the walk does not end until 10:15.
    expect(hasTemporalOverlap(legs)).toBe(true);
  });

  it('still catches a later overlap at an unguaranteed interchange', () => {
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true},
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:09:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
      }),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:19:00.000Z'}),
    ];
    expect(hasTemporalOverlap(legs)).toBe(true);
  });
});

describe('computeTripAimedStartEnd', () => {
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
    const result = computeTripAimedStartEnd(legs);
    expect(result.aimedStartTime).toBe('2024-01-01T10:00:00.000Z');
    expect(result.aimedEndTime).toBe('2024-01-01T10:25:00.000Z');
  });

  it('derives aimed start from first transit leg when first leg is foot', () => {
    const footLeg = makeFootLeg({duration: 300});
    const transitLeg = makeTransitLeg({
      aimedStartTime: '2024-01-01T11:00:00+01:00',
      aimedEndTime: '2024-01-01T11:10:00+01:00',
    });
    const result = computeTripAimedStartEnd([footLeg, transitLeg]);
    // 11:00+01:00 - 300 seconds = 10:55+01:00
    expect(result.aimedStartTime).toBe('2024-01-01T10:55:00+01:00');
    expect(result.aimedEndTime).toBe('2024-01-01T11:10:00+01:00');
  });

  it('derives aimed end from last transit leg when last leg is foot', () => {
    const transitLeg = makeTransitLeg({
      aimedStartTime: '2024-01-01T11:00:00+01:00',
      aimedEndTime: '2024-01-01T11:10:00+01:00',
    });
    const footLeg = makeFootLeg({duration: 300});
    const result = computeTripAimedStartEnd([transitLeg, footLeg]);
    expect(result.aimedStartTime).toBe('2024-01-01T11:00:00+01:00');
    // 11:10+01:00 + 300 seconds = 11:15+01:00
    expect(result.aimedEndTime).toBe('2024-01-01T11:15:00+01:00');
  });

  it('returns empty strings when legs array is empty', () => {
    const result = computeTripAimedStartEnd([]);
    expect(result.aimedStartTime).toBe('');
    expect(result.aimedEndTime).toBe('');
  });
});

describe('adjustNonTransitExpectedTimes', () => {
  it('adjusts leading foot leg based on first transit leg', () => {
    const legs: Leg[] = [
      makeFootLeg({duration: 300}),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:05:00.000Z',
        expectedEndTime: '2024-01-01T10:15:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // 10:05 - 300s = 10:00
    expect(result[0].expectedStartTime).toBe('2024-01-01T10:00:00.000Z');
    expect(result[0].expectedEndTime).toBe('2024-01-01T10:05:00.000Z');
  });

  it('adjusts trailing foot leg based on last transit leg', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeFootLeg({duration: 300}),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // 10:10 + 300s = 10:15
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:10:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:15:00.000Z');
  });

  it('adjusts intermediate foot leg based on previous transit leg', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeFootLeg({duration: 180}),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:20:00.000Z',
        expectedEndTime: '2024-01-01T10:30:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // Walk starts at 10:10 (bus 1 end), ends at 10:10 + 180s = 10:13
    // Gap 10:13 → 10:20 is wait time
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:10:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:13:00.000Z');
  });

  it('does not modify transit legs', () => {
    const legs: Leg[] = [
      makeFootLeg({duration: 300}),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:05:00.000Z',
        expectedEndTime: '2024-01-01T10:15:00.000Z',
      }),
      makeFootLeg({duration: 300}),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:05:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:15:00.000Z');
  });

  it('returns legs unchanged when there are no transit legs', () => {
    const legs: Leg[] = [
      makeFootLeg({
        expectedStartTime: '2024-01-01T09:55:00.000Z',
        expectedEndTime: '2024-01-01T10:00:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    expect(result[0].expectedStartTime).toBe('2024-01-01T09:55:00.000Z');
    expect(result[0].expectedEndTime).toBe('2024-01-01T10:00:00.000Z');
  });

  it('chains multiple consecutive intermediate non-transit legs', () => {
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeFootLeg({duration: 120}),
      makeFootLeg({duration: 60}),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:20:00.000Z',
        expectedEndTime: '2024-01-01T10:30:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // First walk: 10:10 → 10:12
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:10:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:12:00.000Z');
    // Second walk: 10:12 → 10:13
    expect(result[2].expectedStartTime).toBe('2024-01-01T10:12:00.000Z');
    expect(result[2].expectedEndTime).toBe('2024-01-01T10:13:00.000Z');
  });
});

// The rule itself is covered in @atb-as/utils. These check that this repo's
// Leg type feeds it correctly and that the trip-level value reaches the caller.
describe('transfer risk over BFF legs', () => {
  it('stamps the leg you might miss and reports it at trip level', () => {
    const legs = withTransferRisk([
      makeTransitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ]);
    expect(legs[0].transferRisk).toBeUndefined();
    expect(legs[1].transferRisk).toBe(TransferRisk.Uncertain);
    expect(getTripTransferRisk(legs)).toBe(TransferRisk.Uncertain);
  });

  it('agrees with `hasTemporalOverlap` at a zero gap', () => {
    // The two rules run side by side until clients stop reading
    // `status === 'impossible'`, and phase 3 replaces one with the other.
    const legs = [
      makeTransitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:10:00.000Z'}),
    ];
    expect(hasTemporalOverlap(legs)).toBe(false);
    expect(getTripTransferRisk(legs)).toBeUndefined();
  });

  it('reads interchangeTo off a BFF leg, so the guarantee gate fires', () => {
    const legs = withTransferRisk([
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true},
      }),
      makeTransitLeg({expectedStartTime: '2024-01-01T10:00:00.000Z'}),
    ]);
    expect(legs[1].transferRisk).toBeUndefined();
    expect(getTripTransferRisk(legs)).toBeUndefined();
  });
});

describe('determineTripStatus', () => {
  it('returns valid when the only overlap is at a guaranteed interchange', () => {
    const now = new Date().toISOString();
    const legs = [
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true},
        refreshedAt: now,
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:09:00.000Z',
        refreshedAt: now,
      }),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });

  it('returns valid when legs are sequential', () => {
    const now = new Date().toISOString();
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        refreshedAt: now,
      } as Partial<Leg>),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: now,
      } as Partial<Leg>),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });

  it('returns impossible when legs have temporal overlap', () => {
    const now = new Date().toISOString();
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
        refreshedAt: now,
      } as Partial<Leg>),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: now,
      } as Partial<Leg>),
    ];
    expect(determineTripStatus(legs)).toBe('impossible');
  });

  it('returns stale when a leg has an old refreshedAt', () => {
    const now = new Date().toISOString();
    const old = new Date(Date.now() - 60_000).toISOString();
    const legs: Leg[] = [
      makeTransitLeg({refreshedAt: now} as Partial<Leg>),
      makeTransitLeg({refreshedAt: old} as Partial<Leg>),
    ];
    expect(determineTripStatus(legs)).toBe('stale');
  });

  it('returns valid when all legs have similar refreshedAt', () => {
    const now = new Date();
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        refreshedAt: new Date(now.getTime() - 2000).toISOString(),
      } as Partial<Leg>),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: now.toISOString(),
      } as Partial<Leg>),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });

  it('returns stale over impossible when both conditions apply', () => {
    const now = new Date().toISOString();
    const old = new Date(Date.now() - 60_000).toISOString();
    const legs: Leg[] = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
        refreshedAt: now,
      } as Partial<Leg>),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: old,
      } as Partial<Leg>),
    ];
    expect(determineTripStatus(legs)).toBe('stale');
  });

  it('should not crash or mask staleness when refreshedAt contains invalid dates', () => {
    const now = new Date().toISOString();
    const old = new Date(Date.now() - 30000).toISOString();
    const legs = [
      makeTransitLeg({
        refreshedAt: now,
      } as Partial<Leg>),
      makeTransitLeg({
        refreshedAt: 'not-a-valid-date',
      } as Partial<Leg>),
      makeTransitLeg({
        refreshedAt: old,
      } as Partial<Leg>),
    ];
    // The invalid date is filtered out; staleness is still detected between now and old
    expect(determineTripStatus(legs)).toBe('stale');
  });

  it('should return valid when all refreshedAt values are invalid', () => {
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        refreshedAt: 'invalid',
      } as Partial<Leg>),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: 'also-invalid',
      } as Partial<Leg>),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });
});

describe('generateSingleTripQueryString', () => {
  const queryVariables = {
    from: {name: 'A', coordinates: {latitude: 63.4, longitude: 10.4}},
    to: {name: 'B', coordinates: {latitude: 63.5, longitude: 10.5}},
    when: '2024-01-01T09:00:00.000Z',
    arriveBy: false,
    transferSlack: 0,
    transferPenalty: 10,
    waitReluctance: 1,
    walkReluctance: 4,
    walkSpeed: 0.8,
    includeCancellations: true,
  } as TripsQueryVariables;

  const trip = {
    legs: [makeTransitLeg(), makeTransitLeg()],
  } as TripPattern;

  function roundTrip(overrides: Partial<TripsQueryVariables> = {}) {
    return parseTripQueryString(
      generateSingleTripQueryString(trip, {...queryVariables, ...overrides}),
    ).query;
  }

  it('preserves transfer/walk tuning parameters used to reproduce the selected itinerary', () => {
    expect(roundTrip()).toMatchObject({
      transferSlack: 0,
      transferPenalty: 10,
      waitReluctance: 1,
      walkReluctance: 4,
      walkSpeed: 0.8,
    });
  });

  it('preserves a zero transferSlack rather than losing it as falsy', () => {
    expect(roundTrip({transferSlack: 0})).toHaveProperty('transferSlack', 0);
  });

  it('re-times the search to just before the trip starts', () => {
    expect(roundTrip().when).toBe('2024-01-01T09:59:00.000Z');
  });

  it('always resolves forward in time, even for an arriveBy search', () => {
    expect(roundTrip({arriveBy: true}).arriveBy).toBe(false);
  });
});
