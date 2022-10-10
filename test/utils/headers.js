/*
Headers used in the requests
 */

export let bffHeadersGet = {
  headers: {
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'bff-api-tests-k6/0.30.0'
  }
};

export let bffHeadersPost = {
  headers: {
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'bff-api-tests-k6/0.30.0',
    'Content-Type': 'application/json'
  }
};
