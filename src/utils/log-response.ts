/* eslint no-console: 0 */

import {ReqRefDefaults, Request} from '@hapi/hapi';

type LogResponseParams = {
  message: string;
  duration: number;
  requestHeaders: Request<ReqRefDefaults>;
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
  requestHeaders,
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
    correlationId: requestHeaders['correlationId'],
    method: method,
    url: url,
    code: statusCode,
    requestId: requestHeaders['requestId'],
    installId: requestHeaders['installId'],
    webshopVersion: requestHeaders['webshopVersion'],
    appVersion: requestHeaders['appVersion'],
    customerAccountId: customerAccountId,
    rateLimitUsed: rateLimitUsed,
    rateLimitAllowed: rateLimitAllowed,
    rateLimitGroup: operationNameGroup,
    duration: `${duration}ms`,
    error: error,
  };
  console.log(JSON.stringify(log));
};
