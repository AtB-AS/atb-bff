// eslint-disable-next-line unused-imports/no-unused-imports
import {Request} from '@hapi/hapi';

export interface Logger {
  with: (obj: object) => void;
  /**
   * Writes the line. `force` overrides a previous `suppress()`, so an error
   * response is logged even if the handler asked to drop the line.
   */
  log: (force?: boolean) => void;
  /**
   * Drop this request's log line. Used by high-volume routes that only want
   * to log failures; the default is always to log, so an unexpected code
   * path stays visible.
   */
  suppress: () => void;
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
