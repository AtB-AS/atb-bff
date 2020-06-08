import { Request } from '@hapi/hapi';

export interface LogFmt {
  log: (...keyval: string[]) => void
}

declare module '@hapi/hapi' {
  export interface Request {
    logfmt: LogFmt
  }
}
