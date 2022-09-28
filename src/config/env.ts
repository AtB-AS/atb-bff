export const TICKET_INVITE_KEY: string | undefined =
  process.env.TICKET_INVITE_KEY;
export const PERIOD_TICKET_INVITE_KEY: string | undefined =
  process.env.PERIOD_TICKET_INVITE_KEY;
export const FLEX_TICKET_INVITE_KEY: string | undefined =
  process.env.FLEX_TICKET_INVITE_KEY;
export const ENTUR_BASEURL: string | undefined = process.env.ENTUR_BASEURL;

export const ET_CLIENT_NAME = process.env.CLIENT_NAME || 'atb-bff';

export const PROJECT_ID = process.env.PROJECT_ID;
export const VIPPS_BASE_URL = process.env.VIPPS_BASE_URL;
export const VIPPS_CLIENT_ID = process.env.VIPPS_CLIENT_ID;
export const VIPPS_CLIENT_SECRET = process.env.VIPPS_CLIENT_SECRET;

/**
 * Return a URL to the given service. `serviceKey` should be uppercased.
 */
const getServiceUrl = (
  prefix: string,
  serviceKey: string,
  required: boolean = false
): string => {
  const host = getServiceHost(serviceKey);
  const port = getServicePort(serviceKey);

  if (host === '' || port === '') {
    if (required) {
      console.error(
        `failed to read environment variables for required service: ${serviceKey}`
      );
      process.exit(-1);
    } else {
      return '';
    }
  }

  return `${prefix}${host}:${port}`;
};

const getServiceHost = (serviceKey: string): string => {
  return process.env[`${serviceKey}_SERVICE_HOST`] || '';
};

const getServicePort = (serviceKey: string): string => {
  return process.env[`${serviceKey}_SERVICE_PORT`] || '';
};

export const ENROLLMENT_BASEURL: string = getServiceUrl(
  'http://',
  'ENROLLMENT',
  true
);
export const REDIS_HOST: string = getServiceHost('REDIS');
export const REDIS_PORT: string = getServicePort('REDIS');
