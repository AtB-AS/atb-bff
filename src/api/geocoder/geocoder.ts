import { Coordinates } from '@entur/sdk';

import { IGeocoderService } from '.';

export interface IGetFeatureParams {
  query: string;
  coords?: Coordinates;
  size?: number;
  layers?: string[];
  radius?: number;
}

export const makeGetFeatures = (service: IGeocoderService) => ({
  query,
  coords,
  ...params
}: IGetFeatureParams) => {
  return service.getFeatures(query, coords, params);
};

interface IGetFeaturesReverseParams {
  coords: Coordinates;
  size?: number;
  layers?: string[];
  radius?: number;
}

export const makeGetFeaturesReverse = (service: IGeocoderService) => ({
  coords,
  ...params
}: IGetFeaturesReverseParams) => {
  return service.getFeaturesReverse(coords, params);
};
