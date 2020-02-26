import createService from '@entur/sdk';
import fetch from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';

const agent = new Agent({
  keepAlive: true
});

const service = createService({
  clientName: process.env.CLIENT_NAME || 'atb-mittatb',
  fetch: (url, init) => {
    return fetch(url, {
      agent,
      ...init
    });
  }
});

export default service;
