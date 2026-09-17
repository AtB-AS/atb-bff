// eslint-disable-next-line unused-imports/no-unused-imports
import {Request} from '@hapi/hapi';

export interface Logger {
  with: (obj: object) => void;
  log: () => void;
}

export interface LogFmtRouteOptions {
  payload?: boolean;
}

declare module '@hapi/hapi' {
  export interface Request {
    logfmt: Logger;
  }

  export interface PluginSpecificConfiguration {
    logfmt?: LogFmtRouteOptions;
  }
}
