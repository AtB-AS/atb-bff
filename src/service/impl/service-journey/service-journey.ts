import {journeyPlannerClient} from '../../../graphql/graphql-client';
import {
  MapInfoWithFromAndToQuayV2Document,
  MapInfoWithFromAndToQuayV2Query,
  MapInfoWithFromAndToQuayV2QueryVariables,
  MapInfoWithFromQuayV2Document,
  MapInfoWithFromQuayV2Query,
  MapInfoWithFromQuayV2QueryVariables,
} from './journey-gql/service-journey-map.graphql-gen';
import {ReqRefDefaults, Request} from '@hapi/hapi';

export async function getMapInfoWithFromQuay(
  serviceJourneyId: string,
  fromQuayId: string,
  request: Request<ReqRefDefaults>,
) {
  const variables: MapInfoWithFromQuayV2QueryVariables = {
    serviceJourneyId,
    fromQuayId,
  };
  const result = await journeyPlannerClient(request).query<
    MapInfoWithFromQuayV2Query,
    MapInfoWithFromQuayV2QueryVariables
  >({
    query: MapInfoWithFromQuayV2Document,
    variables,
  });
  return result;
}

export async function getMapInfoWithFromAndToQuay(
  serviceJourneyId: string,
  fromQuayId: string,
  toQuayId: string,
  request: Request<ReqRefDefaults>,
) {
  const variables: MapInfoWithFromAndToQuayV2QueryVariables = {
    serviceJourneyId,
    fromQuayId,
    toQuayId,
  };
  const result = await journeyPlannerClient(request).query<
    MapInfoWithFromAndToQuayV2Query,
    MapInfoWithFromAndToQuayV2QueryVariables
  >({
    query: MapInfoWithFromAndToQuayV2Document,
    variables,
  });
  return result;
}
