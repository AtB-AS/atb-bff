import fetch, {RequestInfo, RequestInit} from 'node-fetch';
import Agent from 'agentkeepalive';
import pThrottle from 'p-throttle';
import {ENROLLMENT_BASEURL} from '../../config/env';
import {Result} from '@badrap/result';
import {APIError} from '../types';
import {IEnrollmentService} from '../../service/interface';

// No real rate limit internally, but might as well limit it to prevent explosions.
const RATE_LIMIT_N = 10;
const RATE_LIMIT_RES_MS = 100;

const agent = new Agent({
  keepAlive: true,
});

const throttle = pThrottle({
  limit: RATE_LIMIT_N,
  interval: RATE_LIMIT_RES_MS,
});

const throttledFetch = throttle(
  (url: RequestInfo, init?: RequestInit | undefined) => {
    return fetch(url, {agent, ...init});
  },
);

export interface EnrollResponse {
  active: boolean;
  enrolled: number;
  analytics_group: string;
}

const request = async <T>(
  method: string,
  url: string,
  payload: any,
): Promise<Result<T, APIError>> => {
  try {
    const response = await throttledFetch(url, {
      method: 'POST',
      headers:
        typeof payload == undefined
          ? undefined
          : {'Content-Type': 'application/json'},
      body: typeof payload == undefined ? undefined : JSON.stringify(payload),
    });
    if (!response.ok) {
      return Result.err(
        new APIError({
          status: response.status,
          message: await response.text(),
        }),
      );
    }
    const data = (await response.json()) as T;
    return Result.ok(data);
  } catch (error) {
    return Result.err(new APIError(error));
  }
};

const service = (): IEnrollmentService => {
  const baseUrl = ENROLLMENT_BASEURL;

  return {
    enroll: async (
      customerAccountId: string,
      enrollmentId: string,
      code: string,
    ) => {
      if (customerAccountId.length < 1) {
        return Result.err(
          new APIError({message: 'Invalid customer account id'}),
        );
      }

      if (enrollmentId.length < 1) {
        return Result.err(new APIError({message: 'Invalid enrollment id'}));
      }

      return await request(
        'POST',
        `${baseUrl}/enrollments/${enrollmentId}/customers`,
        {
          customer_account_id: customerAccountId,
          enrollment_id: enrollmentId,
          code,
        },
      );
    },
  };
};

export default service;
