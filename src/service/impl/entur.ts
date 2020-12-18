import createService from '@entur/sdk';
import fetch from 'node-fetch';
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

const service = (config: Config) => {
  return createService({
    clientName: ET_CLIENT_NAME,
    fetch: pThrottle(
      (url, init) => {
        return fetch(url, {
          agent,
          ...init
        });
      },
      RATE_LIMIT_N,
      RATE_LIMIT_RES_MS
    )
  });
};

export default service;
