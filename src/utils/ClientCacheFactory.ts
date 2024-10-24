import {CacheFactoryInterface} from './CacheFactoryInterface';
import {ServerMethodCache} from '@hapi/hapi/lib/types/server/methods';
import {RouteOptionsCache} from '@hapi/hapi/lib/types/route';

export const ClientCacheFactory: CacheFactoryInterface<RouteOptionsCache> = {
  createCache: (ttlMs) =>
    ttlMs > 0 ? {expiresIn: ttlMs, privacy: 'public'} : undefined,
};
