import { ServiceJourneyEstimatedCallFragment } from '../../../../src/service/impl/service-journey/journey-gql/jp3/service-journey-departures.graphql-gen';

export type PolylineSimplifiedResponseType = {
  start: {
    latitude: number;
    longitude: number;
  };
  stop: {
    latitude: number;
    longitude: number;
  };
};

export type ServiceJourneyDeparturesResponseType = {
  value: Array<ServiceJourneyEstimatedCallFragment>;
};
