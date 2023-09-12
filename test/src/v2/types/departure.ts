import * as Types from '../../../../src/graphql/journey/journeyplanner-types_v3';

export type FavoriteResponseType = {
  data: Array<{
    stopPlace: StopPlaceFragment;
    quays: Array<{
      quay: QuayFragment;
      group: Array<{
        lineInfo: LineInfoFragment;
        departures: Array<DeparturesFragment>;
      }>;
    }>;
  }>;
  metadata: {
    hasNextPage: boolean;
  };
};

type QuayFragment = {
  id: string;
  name: string;
  description: null | string;
  publicCode: string;
  latitude: number;
  longitude: number;
  situations: string[];
  __typename: string;
};

type StopPlaceFragment = {
  id: string;
  name: string;
  description: null | string;
  latitude: number;
  longitude: number;
  __typename: string;
};

type LineInfoFragment = {
  lineName: string;
  lineNumber: number;
  transportMode: string;
  transportSubmode: string;
  quayId: string;
  notices: string[];
  lineId: string;
};

type DeparturesFragment = {
  time: string;
  aimedTime: string;
  predictionInaccurate: boolean;
  realtime: boolean;
  situations: string[];
  serviceJourneyId: string;
  serviceDate: string;
};

export type NearestStopPlacesResponseType = {
  nearest: {
    pageInfo: {
      endCursor?: string;
      hasNextPage: boolean;
    };
    edges: Array<{
      node: {
        distance?: number;
        place: {
          name: string;
          transportMode?: string[];
          description?: string;
          id: string;
          quays: Array<{
            id: string;
            description?: string;
            name: string;
            publicCode?: string;
            stopPlace?: { id: string };
          }>;
        };
      };
    }>;
  };
};

export type RealtimeResponseType = {
  [quayId: string]: {
    quayId: string;
    departures: {
      [serviceJourneyId: string]: {
        serviceJourneyId: string;
        timeData: {
          realtime: boolean;
          expectedDepartureTime: string;
        };
      };
    };
  };
};

export type QuayDeparturesType = {
  quay: {
    id: string;
    description?: string;
    publicCode?: string;
    name: string;
    estimatedCalls: Array<{
      date: any;
      expectedDepartureTime: any;
      aimedDepartureTime: any;
      realtime: boolean;
      cancellation: boolean;
      quay: { id: string };
      destinationDisplay?: { frontText?: string, via?: string[] };
      serviceJourney: {
        id: string;
        line: {
          id: string;
          description?: string;
          publicCode?: string;
          transportMode?: Types.TransportMode;
          transportSubmode?: Types.TransportSubmode;
          notices: Array<{ id: string; text?: string }>;
        };
        journeyPattern?: { notices: Array<{ id: string; text?: string }> };
        notices: Array<{ id: string; text?: string }>;
      };
      situations: Array<{
        id: string;
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{ language?: string; value: string }>;
        description: Array<{ language?: string; value: string }>;
        advice: Array<{ language?: string; value: string }>;
        infoLinks?: Array<{ uri: string; label?: string }>;
        validityPeriod?: { startTime?: any; endTime?: any };
      }>;
      notices: Array<{ id: string; text?: string }>;
    }>;
    situations: Array<{
      id: string;
      situationNumber?: string;
      reportType?: Types.ReportType;
      summary: Array<{ language?: string; value: string }>;
      description: Array<{ language?: string; value: string }>;
      advice: Array<{ language?: string; value: string }>;
      infoLinks?: Array<{ uri: string; label?: string }>;
      validityPeriod?: { startTime?: any; endTime?: any };
    }>;
  };
};
