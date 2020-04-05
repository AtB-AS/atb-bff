import createService from '@entur/sdk';
import fetch from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import { v4 as uuid } from 'uuid';
import pThrottle from 'p-throttle';
import {
  globalStats,
  MeasureUnit,
  TagMap,
  AggregationType
} from '@opencensus/core';

// The actual spike limit set in ApiGee is 120/s, do 100/s to be safe.
const RATE_LIMIT_N = 10;
const RATE_LIMIT_RES_MS = 100;

const MEASURE_INTERVAL = 120 * 1000;
const ENDPOINT_RE = /(http.?:\/\/\S+?\/)(\w+)/;
const instanceId = uuid();

const enturRps = globalStats.createMeasureDouble(
  'entur/requests',
  MeasureUnit.UNIT,
  'Requests upstream to Entur'
);

const endpointTagKey = { name: 'endpoint' };
const instanceIdTagKey = { name: 'instanceId' };

const rpsView = globalStats.createView(
  'rpc/upstream_entur',
  enturRps,
  AggregationType.SUM,
  [endpointTagKey, instanceIdTagKey],
  'Requests upstream'
);
globalStats.registerView(rpsView);

const agent = new Agent({
  keepAlive: true
});

interface Config {}

type EndpointMeasure = {
  endpoint: string;
};

type EndpointTotal = {
  [endpint: string]: number;
};

const reportMetrics = (requests: EndpointMeasure[]) => {
  const totals = requests.reduce((total, measure) => {
    if (total[measure.endpoint] === undefined) {
      total[measure.endpoint] = 1;
    } else {
      total[measure.endpoint] += 1;
    }
    return total;
  }, {} as EndpointTotal);

  const metrics = Object.entries(totals).map(([endpoint, reqs]) => ({
    measure: enturRps,
    value: reqs,
    tag: endpoint
  }));

  metrics.forEach(m => {
    const tagmap = new TagMap();
    tagmap.set(endpointTagKey, { value: m.tag });
    tagmap.set(instanceIdTagKey, { value: instanceId });
    globalStats.record(
      [
        {
          measure: m.measure,
          value: m.value
        }
      ],
      tagmap
    );
  });
};

const service = (config: Config) => {
  let metric: EndpointMeasure[] = [];

  setInterval(() => {
    reportMetrics(metric);
    metric = [];
  }, MEASURE_INTERVAL);

  return createService({
    clientName: process.env.CLIENT_NAME || 'atb - bff',
    fetch: pThrottle(
      (url, init) => {
        const now = new Date();
        let endpoint = 'UNKNOWN';
        const match = url.match(ENDPOINT_RE);
        if (match) {
          endpoint = match[2];
        }
        metric = [...metric, { endpoint }];

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
