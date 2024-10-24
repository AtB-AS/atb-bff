import {ServerMethodCache} from '@hapi/hapi/lib/types/server/methods';
import {RouteOptionsCache} from '@hapi/hapi/lib/types/route';

const EXTERNAL_API_TIMEOUT = 5000;

export const getServerCache = (ttlMs: number): ServerMethodCache | undefined =>
  ttlMs > 0
    ? {expiresIn: ttlMs, generateTimeout: EXTERNAL_API_TIMEOUT}
    : undefined;

export const getClientCache = (ttlMs: number): RouteOptionsCache | undefined =>
  ttlMs > 0 ? {expiresIn: ttlMs, privacy: 'public'} : undefined;
