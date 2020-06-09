import { Request } from '@hapi/hapi';

export interface Logger {
  with: (...keyval: string[]) => void
  log: () => void
}

declare module '@hapi/hapi' {
  export interface Request {
    logfmt: Logger
  }
}
