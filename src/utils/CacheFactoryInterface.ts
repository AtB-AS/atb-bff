export interface CacheFactoryInterface<T> {
  createCache: (ttl: number) => T | undefined;
}
