import createService from '@entur/sdk';
import fetch from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import { v4 as uuid } from 'uuid';

import {
  globalStats,
  MeasureUnit,
  TagMap,
  AggregationType
} from '@opencensus/core';

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
    clientName: process.env.CLIENT_NAME || 'atb-mittatb',

    /* Use environment variable ENTUR_ENV to override usage of production version of Entur
       APIs. Set variable to dev or staging to use development or staging enviroment. */
    hosts: process.env.ENTUR_ENV ? {
      journeyPlanner:  `https://api.${process.env.ENTUR_ENV}.entur.io/journey-planner/v2`,
      geocoder: `https://api.${process.env.ENTUR_ENV}.entur.io/geocoder/v1`,
      nsr: `https://api.${process.env.ENTUR_ENV}.entur.io/stop-places/v1`,
    }: undefined,
    
    fetch: (url, init) => {
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
    }
  });
};
export default service;
