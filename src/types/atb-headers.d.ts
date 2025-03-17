// eslint-disable-next-line unused-imports/no-unused-imports
import {Request} from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface Request {
    installId?: string;
    requestId?: string;
    appVersion?: string;
    webshopVersion?: string;
    correlationId?: string;
    customerAccountId?: string;
    tlsVersion?: string;
  }
}
