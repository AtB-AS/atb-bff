import createService from '@entur/sdk';
import fetch, { RequestInit } from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import { Logging } from '@google-cloud/logging';

const LOGNAME = 'rpc-entur';

const agent = new Agent({
  keepAlive: true
});

const service = (logger: Logging) =>
  createService({
    clientName: process.env.CLIENT_NAME || 'atb-mittatb',
    fetch: (url, init) => {
      const log = logger.log(LOGNAME);
      const text = `rpc to ${url.replace(/(https:\/\/|http:\/\/)/, '')}`;
      const metaData = {
        url,
        headers: init?.headers,
        method: init?.method,
        body: init?.body
      };
      const entry = log.entry(
        { labels: { type: 'rpc' }, resource: { type: 'global ' }, ...metaData },
        text
      );
      log.write(entry);
      return fetch(url, {
        agent,
        ...init
      });
    }
  });

export default service;
