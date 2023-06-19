import fetch, {RequestInit, Response} from 'node-fetch';
import {ENTUR_BASEURL, ET_CLIENT_NAME} from '../config/env';

const baseURL = ENTUR_BASEURL || 'https://api.entur.io';

const performFetch = async (
  url: string,
  init: RequestInit = {},
): Promise<Response> => {
  const response = await fetch(`${baseURL}${url}`, {
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
): Promise<T> => {
  const response = await performFetch(url, {
    ...options,
    method: 'GET',
  });
  return response.json() as T;
};

export const post = async <T>(
  url: string,
  body: object,
  options: RequestInit = {},
): Promise<T> => {
  const response = await performFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.json() as T;
};
