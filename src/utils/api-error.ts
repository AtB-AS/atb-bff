import {boomify} from '@hapi/boom';
import {FetchError, Response} from 'node-fetch';

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
