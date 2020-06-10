import { ResponseObject } from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface ResponseObject {
    isBoom: boolean;
  }
}
