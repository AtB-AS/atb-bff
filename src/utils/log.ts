/* eslint no-console: 0 */

import {ReqRefDefaults, Request} from '@hapi/hapi';

type LogResponseParams = {
  url: string;
  statusCode: number;
  requestHeaders: Request<ReqRefDefaults>;
  responseHeaders: any;
  message: string;
  operationName?: string;
};

export const logResponse = ({
  url,
  statusCode,
  requestHeaders,
  responseHeaders,
  message,
  operationName,
}: LogResponseParams) => {
  const rateLimitUsed = responseHeaders.get('rate-limit-used');
  const rateLimitAllowed = responseHeaders.get('rate-limit-allowed');

  if (rateLimitUsed && rateLimitAllowed) {
    let operationNameGroup;
    if (url.includes('/mobility')) {
      operationNameGroup = 'mobility';
    } else if (url.includes('/journey-planner')) {
      operationNameGroup =
        operationName == 'Trips' ? 'planner-trip' : 'planner-nontrip';
    } else if (url.includes('/geocoder')) {
      operationNameGroup = 'geocoder';
    } else {
      operationNameGroup = 'other';
    }

    const log = {
      time: new Date(responseHeaders.get('date')).toISOString(),
      message: message,
      url: url,
      code: statusCode,
      rateLimitUsed: rateLimitUsed,
      rateLimitAllowed: rateLimitAllowed,
      rateLimitGroup: operationNameGroup,
      correlationId: requestHeaders['correlationId'],
      requestId: requestHeaders['requestId'],
      installId: requestHeaders['installId'],
      appVersion: requestHeaders['appVersion'],
    };
    console.log(JSON.stringify(log));
  }
};
