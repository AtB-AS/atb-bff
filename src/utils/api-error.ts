import {boomify} from '@hapi/boom';
import {FetchError, Response} from 'node-fetch';
import {z} from 'zod';

const STATUS_CODES_TO_FORWARD = [429];

export class APIError extends Error {
  public statusCode?: number = 500;

  constructor(error: any) {
    super();
    if (error instanceof FetchError) {
      switch (error.code) {
        case 'ETIMEDOUT':
        case 'EPIPE':
        case 'ECONNRESET':
        case 'ECONNREFUSED':
        case 'ENOTFOUND':
          this.message = 'Upstream service temporarily unavailable';
          this.statusCode = 503;
      }
    }
    const networkErrorResponse = getNetworkErrorResponse(error);
    if (
      networkErrorResponse &&
      STATUS_CODES_TO_FORWARD.includes(networkErrorResponse.status)
    ) {
      this.message = networkErrorResponse.statusText;
      this.statusCode = networkErrorResponse.status;
    }
    if (error?.message === 'TIMEOUT') {
      this.message = 'Upstream service timed out';
      this.statusCode = 504;
    }

    return boomify(this, {
      statusCode: this.statusCode,
      message: error.message,
    });
  }
}

function getNetworkErrorResponse(error: any): Response | undefined {
  if (error?.networkError?.response instanceof Response) {
    return error.networkError.response;
  }
}

/** https://github.com/AtB-AS/amp-rs/blob/main/amp-http/src/lib.rs */
const HttpError = z.object({
  code: z.number(),
  message: z.string(),
});
type HttpError = z.infer<typeof HttpError>;

/** https://github.com/AtB-AS/amp-rs/blob/main/amp-http/src/lib.rs */
export const ErrorResponse = z.object({
  http: HttpError,
  kind: z.string(),
  message: z.string().nullish(),
  details: z.array(z.unknown()).nullish(),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;

export const getErrorResponse = (error: any): ErrorResponse | undefined => {
  return ErrorResponse.safeParse(error).data;
};
