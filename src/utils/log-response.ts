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
}: LogResponseParams) => {
  const rateLimitUsed = responseHeaders.get('rate-limit-used');
  const rateLimitAllowed = responseHeaders.get('rate-limit-allowed');

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

  const log = {
    severity: severity,
    time: new Date(responseHeaders.get('date')).toISOString(),
    message: message,
    correlationId: requestHeaders['correlationId'],
    method: method,
    url: url,
    code: statusCode,
    requestId: requestHeaders['requestId'],
    installId: requestHeaders['installId'],
    appVersion: requestHeaders['appVersion'],
    customerAccountId: customerAccountId,
    rateLimitUsed: rateLimitUsed,
    rateLimitAllowed: rateLimitAllowed,
    rateLimitGroup: operationNameGroup,
    duration: `${duration}ms`,
  };
  console.log(JSON.stringify(log));
};
