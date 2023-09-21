import fetch, {RequestInit, Response} from 'node-fetch';
import {ENTUR_BASEURL, ET_CLIENT_NAME} from '../config/env';
import {logResponse} from './log-response';
import {HttpsAgent as Agent} from 'agentkeepalive';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {Timer} from './timer';

const enturBaseUrl = ENTUR_BASEURL || 'https://api.entur.io';

const agent = new Agent({
  keepAlive: true,
});

const performFetch = async (
  url: string,
  headers: Request<ReqRefDefaults>,
  init: RequestInit = {},
  baseUrl: string = enturBaseUrl,
): Promise<Response> => {
  const timer = new Timer();
  const response = await fetch(`${baseUrl}${url}`, {
    ...init,
    headers: {
      'ET-Client-Name': ET_CLIENT_NAME,
      'X-Correlation-Id': headers['correlationId'] ?? '',
      ...init.headers,
    },
  });

  logResponse({
    message: 'http call',
    method: init.method,
    url: response.url,
    statusCode: response.status,
    responseHeaders: response.headers,
    requestHeaders: headers,
    duration: timer.getElapsedMs(),
  });

  return response;
};

export const get = async <T>(
  url: string,
  headers: Request<ReqRefDefaults>,
  options: Omit<RequestInit, 'method' | 'agent'> = {},
  baseUrl?: string,
): Promise<T> => {
  const response = await performFetch(
    url,
    headers,
    {
      ...options,
      method: 'GET',
      agent: agent,
    },
    baseUrl,
  );
  return (await response.json()) as T;
};

export const post = async <T>(
  url: string,
  body: object,
  headers: Request<ReqRefDefaults>,
  options: Omit<RequestInit, 'method' | 'agent' | 'body'> = {},
  baseUrl?: string,
): Promise<T | undefined> => {
  const response = await performFetch(
    url,
    headers,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      method: 'POST',
      body: JSON.stringify(body),
      agent: agent,
    },
    baseUrl,
  );
  return response.size > 0 ? ((await response.json()) as T) : undefined;
};
