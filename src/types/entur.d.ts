import { GetFeaturesParams } from '@entur/sdk';

declare module '@entur/sdk' {
  export interface GetFeaturesParams {
    /** @deprecated Use boundary object instead */
    'boundary.rect.min_lon'?: number;
    /** @deprecated Use boundary object instead */
    'boundary.rect.max_lon'?: number;
    /** @deprecated Use boundary object instead */
    'boundary.rect.min_lat'?: number;
    /** @deprecated Use boundary object instead */
    'boundary.rect.max_lat'?: number;
    /** @deprecated Use boundary object instead */
    'boundary.country'?: string;
    /** @deprecated Use boundary object instead */
    'boundary.county_ids'?: string;
    /** @deprecated Use boundary object instead */
    'boundary.locality_ids'?: string;
    multiModal?: 'parent' | 'child' | 'all';
    limit?: number;

    'focus.weight'?: number;
    'focus.function'?: 'linear' | 'exp';
    'focus.scale'?: string;
  }
}
