import * as MapDataTypes from '../service/impl/service-journey/journey-gql/jp3/mapData.graphql-gen';
import * as JP3Types from '../../src/graphql/journeyplanner-types_v3';

import {TransportSubmode} from "../graphql/journey-types";

export type MapDataQuery = MapDataTypes.MapDataQuery;


type MapLeg = {
  mode?: JP3Types.Mode,
  faded?: boolean,
  transportSubMode: JP3Types.TransportSubmode,
  pointsOnLink: JP3Types.PointsOnLink,
}

export type MapData = {
  mapLegs: MapLeg[];
  start?: JP3Types.Scalars['Coordinates'];
  stop?: JP3Types.Scalars['Coordinates'];
};

