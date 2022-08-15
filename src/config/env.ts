export const TICKET_INVITE_KEY: string | undefined =
  process.env.TICKET_INVITE_KEY;
export const PERIOD_TICKET_INVITE_KEY: string | undefined =
  process.env.PERIOD_TICKET_INVITE_KEY;
export const FLEX_TICKET_INVITE_KEY: string | undefined =
  process.env.FLEX_TICKET_INVITE_KEY;
export const ENTUR_BASEURL: string | undefined = process.env.ENTUR_BASEURL;

export const ET_CLIENT_NAME = process.env.CLIENT_NAME || 'atb-bff';

export const PROJECT_ID: string | undefined = process.env.PROJECT_ID;
export const VIPPS_BASE_URL: string | undefined = process.env.VIPPS_BASE_URL;
export const VIPPS_CLIENT_ID: string | undefined = process.env.VIPPS_CLIENT_ID;
export const VIPPS_CLIENT_SECRET: string | undefined = process.env.VIPPS_CLIENT_SECRET;
export const VIPPS_CALLBACK_URL: string | undefined  = process.env.VIPPS_CALLBACK_URL;
//GOOGLE_APPLICATION_CREDENTIALS env variable is required by firebase admin to fetch a valid Google OAuth2 access token,
//so that we can check if user exists or not by phone number