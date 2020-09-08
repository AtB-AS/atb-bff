import { convertPositionToBbox } from '@entur/sdk';
import client from '../../../graphql/graphql-client';
import {
  GetStopPlacesByBboxDocument,
  GetStopPlacesByBboxQueryVariables,
  GetStopPlacesByBboxQuery
} from './stop-places-by-bbox.graphql-gen';
import { Result } from '@badrap/result';
import { StopPlacesByBboxData, APIError, Coordinates } from '../../types';

export async function stopPlacesByBbox(
  coordinates: Coordinates,
  distance: number = 500,
  filterByInUse?: boolean
): Promise<Result<StopPlacesByBboxData[], APIError>> {
  const bbox = convertPositionToBbox(coordinates, distance);

  const variables: GetStopPlacesByBboxQueryVariables = {
    ...bbox,
    filterByInUse: !!filterByInUse
  };

  const result = await client.query<
    GetStopPlacesByBboxQuery,
    GetStopPlacesByBboxQueryVariables
  >({
    query: GetStopPlacesByBboxDocument,
    variables
  });

  if (result.errors) {
    return Result.err(new APIError(result.errors));
  }

  return Result.ok(result.data.stopPlacesByBbox);
}
