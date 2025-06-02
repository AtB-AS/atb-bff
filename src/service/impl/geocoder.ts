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

const FOCUS_WEIGHT = parseInt(process.env.GEOCODER_FOCUS_WEIGHT || '18');
const SCALE = parseInt(process.env.GEOCODER_SCALE || '200');

export default (): IGeocoderService => {
  return {
    async getFeatures(params, request) {
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
            scale: `${SCALE}km`,
            function: 'exp',
          },
        };
        const queryString = qs.stringify(autocompleteParams, {
          allowDots: true,
          arrayFormat: 'comma',
        });
        const result = await get<FeatureCollection<Point, Location>>(
          `/geocoder/v1/autocomplete?${queryString}`,
          request,
        );
        return Result.ok(result.features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getFeaturesReverse({lat, lon, ...params}, request) {
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
          request,
        );

        return Result.ok(result.features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
  };
};
