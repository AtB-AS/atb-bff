import { Request } from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface Request {
    installId?: string;
    requestId?: string;
  }
}
