import createService from '@entur/sdk';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import pThrottle from 'p-throttle';
import { ET_CLIENT_NAME } from '../../config/env';

// The actual spike limit set in ApiGee is 120/s, do 100/s to be safe.
const RATE_LIMIT_N = 10;
const RATE_LIMIT_RES_MS = 100;

const agent = new Agent({
  keepAlive: true
});

interface Config {}

const throttle = pThrottle({
  limit: RATE_LIMIT_N,
  interval: RATE_LIMIT_RES_MS
});

export type EnturServiceAPI = ReturnType<typeof createService>;

const service = (config: Config) => {
  return createService({
    clientName: ET_CLIENT_NAME,
    fetch: throttle((url: RequestInfo, init?: RequestInit | undefined) => {
      return fetch(url, {
        agent,
        ...init
      });
    })
  });
};

export default service;
