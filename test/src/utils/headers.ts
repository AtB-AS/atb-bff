/*
Headers used in the requests
 */

export const bffHeadersGet = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent': 'bff-api-tests-k6/0.30.0',
  "atb-app-version": 1.58,
};

export const bffHeadersPost = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent': 'bff-api-tests-k6/0.30.0',
  'Content-Type': 'application/json',
  "atb-app-version": 1.58,
};
