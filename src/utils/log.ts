/* eslint no-console: 0 */

/**
 * Structured one-line JSON log, same shape as `logResponse`, for events that
 * aren't tied to a request (startup, warmup).
 */
export const logInfo = (
  message: string,
  fields: Record<string, unknown> = {},
) =>
  console.log(
    JSON.stringify({
      severity: 'INFO',
      time: new Date().toISOString(),
      message,
      ...fields,
    }),
  );
