// eslint-disable-next-line unused-imports/no-unused-imports
import { ResponseObject } from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface ResponseObject {
    isBoom: boolean;
  }
}
