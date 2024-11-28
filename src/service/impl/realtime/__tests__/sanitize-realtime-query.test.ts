import {sanitizeRealtimeQuery} from '../sanitize-realtime-query';
import type {DepartureRealtimeQuery} from '../../../types';
import {addHours, addMinutes} from 'date-fns';

const createQuery = (startTime: Date): DepartureRealtimeQuery => ({
  quayIds: [],
  limit: 10,
  startTime,
});

describe('sanitizeRealtimeQuery', () => {
  it('When start time is now the sanitized start time should be unchanged and time range should be 30 minutes', () => {
    const startTime = new Date();
    const sanitized = sanitizeRealtimeQuery(createQuery(startTime));

    expect(sanitized?.timeRange).toBeDefined();
    expect(
      diff(sanitized!.startTime.getTime(), startTime.getTime()),
    ).toBeLessThan(5);
    expect(diff(sanitized!.timeRange, 1800)).toBeLessThanOrEqual(1);
  });

  it('When start time is in the past the sanitized start time should be now and time range should be 30 minutes', () => {
    const startTime = addHours(new Date(), -2);
    const sanitized = sanitizeRealtimeQuery(createQuery(startTime));

    expect(sanitized?.timeRange).toBeDefined();
    expect(
      diff(sanitized!.startTime.getTime(), new Date().getTime()),
    ).toBeLessThan(5);
    expect(diff(sanitized!.timeRange, 1800)).toBeLessThanOrEqual(1);
  });

  it('When start time is 15 minutes in the future the sanitized start time should be unchanged and time range should be 15 minutes', () => {
    const startTime = addMinutes(new Date(), 15);
    const sanitized = sanitizeRealtimeQuery(createQuery(startTime));

    expect(sanitized?.timeRange).toBeDefined();
    expect(
      diff(sanitized!.startTime.getTime(), startTime.getTime()),
    ).toBeLessThan(5);
    expect(diff(sanitized!.timeRange, 900)).toBeLessThanOrEqual(1);
  });

  it('When start time is 45 minutes in the future the sanitized query should be undefined', () => {
    const startTime = addMinutes(new Date(), 45);
    const sanitized = sanitizeRealtimeQuery(createQuery(startTime));
    expect(sanitized).toBeUndefined();
  });
});

const diff = (v1: number, v2: number) => Math.abs(v1 - v2);
