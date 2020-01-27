import { Feature, Location } from '@entur/sdk';

declare module '@entur/sdk' {
  export function convertFeatureToLocation(feature: Feature): Location;

  // Fix a typo in Enturs typings
  export function throttler<T, U>(
    queryHandler: (q: T) => Promise<U>,
    queries: T[]
  ): Promise<U[]>;
}
