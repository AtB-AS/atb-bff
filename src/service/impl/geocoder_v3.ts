import {Result} from '@badrap/result';
import {FeatureCollection, Point} from 'geojson';
import qs from 'qs';
import {GeocoderV3Layer, LocationV3} from '../types';
import {APIError} from '../../utils/api-error';
import {get} from '../../utils/fetch-client';
import {IGeocoderService_v3} from '../interface';

interface AutocompleteV3Params {
  q: string;
  lang?: string;
  limit?: number;
  lat?: number;
  lon?: number;
  radius?: number;
  weight?: number;
  layers?: GeocoderV3Layer[];
  multimodal?: 'parent' | 'child' | 'all';
  fareZoneAuthorities?: string[];
}

interface ReverseV3Params {
  lat: number;
  lon: number;
  radius?: number;
  lang?: string;
  limit?: number;
  layers?: GeocoderV3Layer[];
}

const GEOCODER_V3_BASEURL = 'https://api.dev.entur.io';

const FOCUS_WEIGHT = parseFloat(process.env.GEOCODER_V3_FOCUS_WEIGHT || '0.7');
const RADIUS = parseInt(process.env.GEOCODER_V3_RADIUS || '60');

export default (): IGeocoderService_v3 => {
  return {
    async getFeatures(params, request) {
      try {
        const focusParams =
          params.lat !== undefined && params.lon !== undefined
            ? {
                lat: params.lat,
                lon: params.lon,
                radius: RADIUS,
                weight: FOCUS_WEIGHT,
              }
            : {};
        const autocompleteParams: AutocompleteV3Params = {
          q: params.query,
          lang: params.lang,
          limit: params.limit,
          layers: params.layers,
          multimodal: params.multimodal,
          fareZoneAuthorities: params.fareZoneAuthorities,
          ...focusParams,
        };
        const queryString = qs.stringify(autocompleteParams, {
          allowDots: true,
          arrayFormat: 'comma',
          skipNulls: true,
        });
        const result = await get<FeatureCollection<Point, LocationV3>>(
          `/geocoder/v3/autocomplete?${queryString}`,
          request,
          {},
          GEOCODER_V3_BASEURL,
        );
        return Result.ok(result.features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getFeaturesReverse({lat, lon, ...params}, request) {
      try {
        const reverseParams: ReverseV3Params = {
          lat,
          lon,
          radius: params.radius,
          lang: params.lang,
          limit: params.limit,
          layers: params.layers,
        };
        const queryString = qs.stringify(reverseParams, {
          allowDots: true,
          arrayFormat: 'comma',
          skipNulls: true,
        });
        const result = await get<FeatureCollection<Point, LocationV3>>(
          `/geocoder/v3/reverse?${queryString}`,
          request,
          {},
          GEOCODER_V3_BASEURL,
        );
        return Result.ok(result.features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
