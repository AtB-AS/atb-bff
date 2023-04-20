export function getUrlParam(url: string, param: string) {
  return new URL(url, 'https://example.com').searchParams.get(param);
}
