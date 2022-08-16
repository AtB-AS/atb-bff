export const TICKET_INVITE_KEY: string | undefined =
  process.env.TICKET_INVITE_KEY;
export const PERIOD_TICKET_INVITE_KEY: string | undefined =
  process.env.PERIOD_TICKET_INVITE_KEY;
export const FLEX_TICKET_INVITE_KEY: string | undefined =
  process.env.FLEX_TICKET_INVITE_KEY;
export const ENTUR_BASEURL: string | undefined = process.env.ENTUR_BASEURL;

export const ET_CLIENT_NAME = process.env.CLIENT_NAME || 'atb-bff';

export const PROJECT_ID = process.env.PROJECT_ID || 'atb-mobility-platform-staging'
export const VIPPS_BASE_URL = process.env.VIPPS_BASE_URL || 'https://apitest.vipps.no'
export const VIPPS_CLIENT_ID = process.env.VIPPS_CLIENT_ID || '87a6476b-68ec-4ca9-8626-ca3d62f41458';
export const VIPPS_CLIENT_SECRET = process.env.VIPPS_CLIENT_SECRET  || 'xfPqPQKxTVHZDkkIEg18Mg==';
export const VIPPS_CALLBACK_URL = process.env.VIPPS_CALLBACK_URL || 'atb://auth/vipps';
//GOOGLE_APPLICATION_CREDENTIALS env variable is required by firebase admin to fetch a valid Google OAuth2 access token,
//so that we can check if user exists or not by phone number