// eslint-disable-next-line unused-imports/no-unused-imports
import {Request} from '@hapi/hapi';

export interface Logger {
  with: (obj: object) => void;
  log: () => void;
}

declare module '@hapi/hapi' {
  export interface Request {
    logfmt: Logger;
  }
}
