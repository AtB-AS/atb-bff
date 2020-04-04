export function getEnv() {
  return process.env['NODE_ENV'] === 'production' ? 'prod' : 'dev';
}