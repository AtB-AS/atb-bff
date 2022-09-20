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

// TODO: Should error out if this isn't set or a valid URL.
export const ENROLLMENT_BASEURL: string = process.env.ENROLLMENT_BASEURL || '';
