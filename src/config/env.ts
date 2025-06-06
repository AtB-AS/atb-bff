import 'dotenv/config';
import {getEnv} from '../utils/get-env';
import {DEFAULT_CACHE_TTL_MS} from './cache';

export const TICKET_INVITE_KEY: string | undefined =
  process.env.TICKET_INVITE_KEY;
export const PERIOD_TICKET_INVITE_KEY: string | undefined =
  process.env.PERIOD_TICKET_INVITE_KEY;
export const FLEX_TICKET_INVITE_KEY: string | undefined =
  process.env.FLEX_TICKET_INVITE_KEY;
export const ENTUR_BASEURL: string | undefined = process.env.ENTUR_BASEURL;
export const ENTUR_WEBSOCKET_BASEURL: string | undefined =
  process.env.ENTUR_WEBSOCKET_BASEURL;
export const SHMO_INVITE_KEY: string | undefined = process.env.SHMO_INVITE_KEY;

export const ET_CLIENT_NAME = process.env.CLIENT_NAME || 'atb-bff';

export const PROJECT_ID = process.env.PROJECT_ID;
export const NIVEL_BASEURL: string | undefined = process.env.NIVEL_BASEURL;
export const NIVEL_API_KEY: string | undefined = process.env.NIVEL_API_KEY;

/**
 * The base URL for the API, used in development mode. Use `getServiceUrl` to
 * connect directly to service in production.
 */
const API_BASE_URL: string | undefined = process.env.API_BASE_URL;

/**
 * Return a URL to the given service. `serviceKey` should be uppercased.
 */
const getServiceUrl = (
  prefix: string,
  serviceKey: string,
  required: boolean = false,
): string => {
  if (getEnv() === 'dev') return API_BASE_URL ?? '';

  const host = getServiceHost(serviceKey);
  const port = getServicePort(serviceKey);

  if (host === '' || port === '') {
    if (required) {
      console.error(
        `failed to read environment variables for required service: ${serviceKey}`,
      );
      process.exit(-1);
    } else {
      return '';
    }
  }

  return `${prefix}${host}:${port}`;
};

const getServiceHost = (serviceKey: string): string => {
  return (
    process.env[`${serviceKey}_SERVICE_SERVICE_HOST`] ||
    process.env[`${serviceKey}_SERVICE_HOST`] ||
    ''
  );
};

const getServicePort = (serviceKey: string): string => {
  return (
    process.env[`${serviceKey}_SERVICE_SERVICE_PORT`] ||
    process.env[`${serviceKey}_SERVICE_PORT`] ||
    ''
  );
};

const getInteger = (envKey: string): number | undefined => {
  const envVar = process.env[envKey];
  const isInteger = !!envVar && /^\d+$/.test(envVar);
  return isInteger ? Number(envVar) : undefined;
};

export const ENROLLMENT_BASEURL: string = getServiceUrl(
  'http://',
  'ENROLLMENT',
  getEnv() === 'prod',
);
export const SALES_BASEURL: string = getServiceUrl('http://', 'SALES', false);
export const REDIS_HOST: string = getServiceHost('REDIS');
export const REDIS_PORT: string = getServicePort('REDIS');

const CACHE_TTL_MS_SERVER =
  getInteger('CACHE_TTL_MS_SERVER') ?? DEFAULT_CACHE_TTL_MS;
export const CACHE_TTL_MS_SERVER_GEOCODER_REVERSE =
  getInteger('CACHE_TTL_MS_SERVER_GEOCODER_REVERSE') ?? CACHE_TTL_MS_SERVER;
export const CACHE_TTL_MS_SERVER_GEOCODER_FEATURES =
  getInteger('CACHE_TTL_MS_SERVER_GEOCODER_FEATURES') ?? CACHE_TTL_MS_SERVER;
export const CACHE_TTL_MS_SERVER_SERVICE_JOURNEY_MAP_INFO =
  getInteger('CACHE_TTL_MS_SERVER_SERVICE_JOURNEY_MAP_INFO') ??
  CACHE_TTL_MS_SERVER;
export const CACHE_TTL_MS_CLIENT =
  getInteger('CACHE_TTL_MS_CLIENT') ?? DEFAULT_CACHE_TTL_MS;
