import createService from '@entur/sdk';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import pThrottle from 'p-throttle';
import { ET_CLIENT_NAME, ENTUR_BASEURL } from '../../config/env';

// The actual spike limit set in ApiGee is 120/s, do 100/s to be safe.
const RATE_LIMIT_N = 10;
const RATE_LIMIT_RES_MS = 100;

const agent = new Agent({
  keepAlive: true
});

const throttle = pThrottle({
  limit: RATE_LIMIT_N,
  interval: RATE_LIMIT_RES_MS
});

export type EnturServiceAPI = ReturnType<typeof createService>;

const service = () => {
  return createService({
    clientName: ET_CLIENT_NAME,
    /* Use environment variable ENTUR_ENV to override usage of production version of Entur
   APIs. Set variable to dev or staging to use development or staging enviroment. */
    hosts: ENTUR_BASEURL
      ? {
          journeyPlanner: `${ENTUR_BASEURL}/journey-planner/v2`,
          geocoder: `${ENTUR_BASEURL}/geocoder/v1`,
          nsr: `${ENTUR_BASEURL}/stop-places/v1`
        }
      : undefined,
    fetch: throttle((url: RequestInfo, init?: RequestInit | undefined) => {
      return fetch(url, {
        agent,
        ...init
      });
    })
  });
};

export const enturClient_v3 = () => {
  return createService({
    clientName: ET_CLIENT_NAME,
    /* Use environment variable ENTUR_ENV to override usage of production version of Entur
   APIs. Set variable to dev or staging to use development or staging enviroment. */
    hosts: ENTUR_BASEURL
      ? {
        journeyPlanner: `${ENTUR_BASEURL}/journey-planner/v3`,
        geocoder: `${ENTUR_BASEURL}/geocoder/v1`,
        nsr: `${ENTUR_BASEURL}/stop-places/v1`
      }
      : undefined,
    fetch: throttle((url: RequestInfo, init?: RequestInit | undefined) => {
      return fetch(url, {
        agent,
        ...init
      });
    })
  });
};


export default service;
