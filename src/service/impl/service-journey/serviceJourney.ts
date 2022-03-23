import {
    MapInfoWithFromAndToQuayV2Document,
    MapInfoWithFromAndToQuayV2Query,
    MapInfoWithFromAndToQuayV2QueryVariables,

    MapInfoWithFromQuayV2Document,
    MapInfoWithFromQuayV2Query,
    MapInfoWithFromQuayV2QueryVariables,

} from "./journey-gql/jp3/service-journey-map.graphql-gen";
import {journeyPlannerClient} from "../../../graphql/graphql-client";


export async function getMapInfoWithFromQuay(
    serviceJourneyId: string,
    fromQuayId: string,
) {
    const variables: MapInfoWithFromQuayV2QueryVariables = {
        serviceJourneyId,
        fromQuayId,
    };
    const result = await journeyPlannerClient.query<
        MapInfoWithFromQuayV2Query,
        MapInfoWithFromQuayV2QueryVariables
        >({
        query: MapInfoWithFromQuayV2Document,
        variables,
        fetchPolicy: 'cache-first'
    });
    return result;
}

export async function getMapInfoWithFromAndToQuay(
    serviceJourneyId: string,
    fromQuayId: string,
    toQuayId: string,
) {
    const variables: MapInfoWithFromAndToQuayV2QueryVariables = {
        serviceJourneyId,
        fromQuayId,
        toQuayId,
    };
    const result = await journeyPlannerClient.query<
        MapInfoWithFromAndToQuayV2Query,
        MapInfoWithFromAndToQuayV2QueryVariables
        >({
        query: MapInfoWithFromAndToQuayV2Document,
        variables,
        fetchPolicy: 'cache-first'
    });
    return result;
}
