import { ServiceJourneyEstimatedCallFragment } from '../../../../src/service/impl/service-journey/journey-gql/service-journey-departures.graphql-gen';
import * as Types from '../../../../src/graphql/journeyplanner-types_v3';

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

type NoticesType = Array<{ id: string; text?: string }>;

export type ServiceJourneyCallsResponseType = {
  value: {
    id: string;
    transportMode: Types.TransportMode;
    transportSubmode: Types.TransportSubmode;
    publicCode: string | null;
    line: {
      publicCode: string;
      notices: NoticesType;
      __typename: string;
    };
    journeyPattern: {
      notices: NoticesType;
      __typename: string;
    };
    notices: NoticesType;
    estimatedCalls: Array<ServiceJourneyEstimatedCallFragment>;
    __typename: string;
  };
  isOk: boolean;
  isErr: boolean;
};
