/*
Headers used in the requests
 */

import {sleep} from 'k6';
import {sleepPrReq} from '../config/configuration';

export const bffHeadersGet = (): any => {
  // To avoid rate limiting - since everyone uses this header function
  sleep(sleepPrReq);

  return {
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'bff-api-tests-k6/0.30.0',
    'atb-app-version': '1.63',
  };
};

export const bffHeadersPost = (): any => {
  // To avoid rate limiting - since everyone uses this header function
  sleep(sleepPrReq);

  return {
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'bff-api-tests-k6/0.30.0',
    'Content-Type': 'application/json',
    'atb-app-version': '1.63',
  };
};
