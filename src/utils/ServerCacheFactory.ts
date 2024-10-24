import {CacheFactoryInterface} from './CacheFactoryInterface';
import {ServerMethodCache} from '@hapi/hapi/lib/types/server/methods';

export const ServerCacheFactory: CacheFactoryInterface<ServerMethodCache> = {
  createCache: (ttlMs) =>
    ttlMs > 0 ? {expiresIn: ttlMs, generateTimeout: 5000} : undefined,
};
