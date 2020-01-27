import { Coordinates } from '@entur/sdk';

import { IStopsService } from '.';

export const makeGetStopPlace = (service: IStopsService) => async (
  id: string
) => {
  try {
    return await service.getStopPlace(id);
  } catch (error) {
    /* TODO: Inject a modified service to override this behaviour? */
    if (error instanceof Error) {
      const re = /Could not find stop place with ID (.*)/;
      if (error.message.match(re)) return null;
      throw error;
    }
    throw error;
  }
};

interface IGetStopDeparturesParams {
  id: string;
  start?: Date;
  timeRange?: number;
  limit?: number;
  includeNonBoarding?: boolean;
}

export const makeGetStopDepartures = (service: IStopsService) => ({
  id,
  ...params
}: IGetStopDeparturesParams) => {
  return service.getDeparturesFromStopPlace(id, params);
};

interface IFindStopsParams {
  coords: Coordinates;
  distance?: number;
}
export const makeFindStops = (service: IStopsService) => ({
  coords,
  distance
}: IFindStopsParams) => {
  {
    return service.getStopPlacesByPosition(coords, distance);
  }
};
