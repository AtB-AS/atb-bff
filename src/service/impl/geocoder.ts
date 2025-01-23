import {Result} from '@badrap/result';
import {FeatureCollection, Point} from 'geojson';
import qs from 'qs';
import {
  AutocompleteParams,
  ReverseParams,
  Location,
} from '../../types/geocoder';
import {APIError} from '../../utils/api-error';
import {get} from '../../utils/fetch-client';
import {IGeocoderService} from '../interface';
import {temporarilyPrioritizeWorldCupFeatures} from '../../utils/temporarily-prioritize-world-cup-features';

const FOCUS_WEIGHT = parseInt(process.env.GEOCODER_FOCUS_WEIGHT || '18');

export default (): IGeocoderService => {
  return {
    async getFeatures(params, headers) {
      try {
        const autocompleteParams: AutocompleteParams = {
          text: params.query,
          lang: 'no',
          size: params.limit,
          layers: params.layers,
          multiModal: params.multiModal,
          tariffZoneAuthorities: params.tariff_zone_authorities,
          focus: {
            point: {
              lat: params.lat,
              lon: params.lon,
            },
            weight: FOCUS_WEIGHT,
            scale: '200km',
            function: 'exp',
          },
        };
        const queryString = qs.stringify(autocompleteParams, {
          allowDots: true,
          arrayFormat: 'comma',
        });
        const result = await get<FeatureCollection<Point, Location>>(
          `/geocoder/v1/autocomplete?${queryString}`,
          headers,
        );
        const prioritizedFeatures = temporarilyPrioritizeWorldCupFeatures(
          result.features,
        );
        return Result.ok(prioritizedFeatures);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getFeaturesReverse({lat, lon, ...params}, headers) {
      try {
        const reverseParams: ReverseParams = {
          size: params.limit,
          layers: params.layers,
          point: {
            lat: lat,
            lon: lon,
          },
        };
        const queryString = qs.stringify(reverseParams, {
          allowDots: true,
          arrayFormat: 'comma',
        });
        const result = await get<FeatureCollection<Point, Location>>(
          `/geocoder/v1/reverse?${queryString}`,
          headers,
        );

        return Result.ok(result.features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
