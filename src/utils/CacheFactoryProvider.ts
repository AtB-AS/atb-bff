import {ClientCacheFactory} from './ClientCacheFactory';
import {ServerCacheFactory} from './ServerCacheFactory';
import {CacheFactoryInterface} from './CacheFactoryInterface';

type CacheType = 'client' | 'server';

export const CacheFactoryProvider = {
  getFactory: (type: CacheType): CacheFactoryInterface<any> => {
    switch (type) {
      case 'client':
        return ClientCacheFactory;
      case 'server':
        return ServerCacheFactory;
    }
  },
};
