import createService from '@entur/sdk';
import fetch from 'node-fetch';
import { HttpsAgent as Agent } from 'agentkeepalive';
import monitoring from '@google-cloud/monitoring';

const agent = new Agent({
  keepAlive: true
});

const client = new monitoring.MetricServiceClient();

const service = createService({
  clientName: process.env.CLIENT_NAME || 'atb-mittatb',
  fetch: (url, init) => {
    console.log('fetch');
    const match = url.match(/\/(\w+)\//);
    const endpoint = (match && match[1]) || 'NOT-MAPPED';

    // Prepares an individual data point
    const dataPoint = {
      interval: {
        endTime: {
          seconds: Date.now() / 1000
        }
      },
      value: {
        int64Value: 1
      }
    };

    // Prepares the time series request
    const request = {
      name: client.projectPath('atb-mobility-platform'),
      timeSeries: [
        {
          metric: {
            type: 'custom.googleapis.com/rpc/entur',
            labels: {
              endpoint,
              method: init?.method,
              headers: init?.headers,
              payload: init?.payload
            }
          },
          resource: {
            type: 'global',
            labels: {
              project_id: 'atb-mobility-platform'
            }
          },
          points: [dataPoint]
        }
      ]
    };

    // Writes time series data
    client
      .createTimeSeries(request)
      .then(res => console.log('monitoring request succeeded'))
      .catch(err => console.error('failed to send monitoring request: ', err));

    return fetch(url, {
      agent,
      ...init
    });
  }
});

export default service;
