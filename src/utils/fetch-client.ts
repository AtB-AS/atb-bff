import fetch, {RequestInit, Response} from 'node-fetch';
import {ENTUR_BASEURL, ET_CLIENT_NAME} from '../config/env';
import {HttpsAgent as Agent} from 'agentkeepalive';

const enturBaseUrl = ENTUR_BASEURL || 'https://api.entur.io';

const agent = new Agent({
  keepAlive: true,
});

const performFetch = async (
  url: string,
  init: RequestInit = {},
  baseUrl: string = enturBaseUrl,
): Promise<Response> => {
  const response = await fetch(`${baseUrl}${url}`, {
    ...init,
    headers: {
      'ET-Client-Name': ET_CLIENT_NAME,
      ...init.headers,
    },
  });
  return response;
};

export const get = async <T>(
  url: string,
  options: RequestInit = {},
  baseUrl?: string,
): Promise<T> => {
  const response = await performFetch(
    url,
    {
      ...options,
      method: 'GET',
      agent: agent,
    },
    baseUrl,
  );
  return response.json() as T;
};

export const post = async <T>(
  url: string,
  body: object,
  options: RequestInit,
  baseUrl?: string,
): Promise<T> => {
  const response = await performFetch(
    url,
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
  return response.json() as T;
};
