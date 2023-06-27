/**
 * @param url The path and search part of an URL, excluding hostname. (Request URL)
 * @param param Name of the search parameter to get
 * @returns Value of the search parameter
 */
export function getUrlParam(url: string, param: string) {
  // Adding an arbitrary domain here to enable parsing as a regular URL. It
  // won't affect the return value, as only search parameters used.
  return new URL(url, 'https://example.com').searchParams.get(param);
}
