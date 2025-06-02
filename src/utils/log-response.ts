/* eslint no-console: 0 */

import {ReqRefDefaults, Request} from '@hapi/hapi';

type LogResponseParams = {
  message: string;
  duration: number;
  request: Request<ReqRefDefaults>;
  responseHeaders?: any;
  url?: string;
  statusCode?: number;
  method?: string;
  operationName?: string;
  customerAccountId?: string;
  error?: string;
};

export const logResponse = ({
  message,
  duration,
  request,
  responseHeaders,
  url,
  statusCode,
  method,
  operationName,
  customerAccountId,
  error,
}: LogResponseParams) => {
  const rateLimitUsed = responseHeaders?.get('rate-limit-used');
  const rateLimitAllowed = responseHeaders?.get('rate-limit-allowed');

  let operationNameGroup = 'other';
  if (url) {
    if (url.includes('/mobility')) {
      operationNameGroup = 'mobility';
    } else if (url.includes('/journey-planner')) {
      operationNameGroup =
        operationName == 'Trips' ? 'planner-trip' : 'planner-nontrip';
    } else if (url.includes('/geocoder')) {
      operationNameGroup = 'geocoder';
    }
  }

  let severity = 'INFO';
  if (statusCode && statusCode >= 400) {
    severity = 'ERROR';
  }

  const time = responseHeaders
    ? new Date(responseHeaders?.get('date')).toISOString()
    : new Date().toISOString();

  const log = {
    severity: severity,
    time: time,
    message: message,
    correlationId: request['correlationId'],
    method: method,
    url: url,
    code: statusCode,
    requestId: request['requestId'],
    installId: request['installId'],
    webshopVersion: request['webshopVersion'],
    appVersion: request['appVersion'],
    customerAccountId: customerAccountId,
    rateLimitUsed: rateLimitUsed,
    rateLimitAllowed: rateLimitAllowed,
    rateLimitGroup: operationNameGroup,
    duration: `${duration}ms`,
    error: error,
  };
  console.log(JSON.stringify(log));
};
