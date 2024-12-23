import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { NoticeFragment } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragment } from '../../fragments/journey-gql/situations.graphql-gen';
import { BookingArrangementFragment } from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
import { LineFragment } from '../../fragments/journey-gql/lines.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
import { BookingArrangementFragmentDoc } from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
import { LineFragmentDoc } from '../../fragments/journey-gql/lines.graphql-gen';
export type GroupsByIdQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
  startTime: Types.Scalars['DateTime']['input'];
  timeRange: Types.Scalars['Int']['input'];
  limitPerLine: Types.Scalars['Int']['input'];
  totalLimit: Types.Scalars['Int']['input'];
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>>;
  includeCancelledTrips?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type GroupsByIdQuery = { quays: Array<(
    { stopPlace?: Group_StopPlaceFieldsFragment, times: Array<Group_Times_EstimatedCallFieldsFragment>, estimatedCalls: Array<Group_EstimatedCallFieldsFragment> }
    & Group_QuayFieldsFragment
  )> };

export type QuayIdInStopsQueryVariables = Types.Exact<{
  stopIds: Array<Types.InputMaybe<Types.Scalars['String']['input']>> | Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type QuayIdInStopsQuery = { stopPlaces: Array<{ id: string, quays?: Array<{ id: string }> }> };

export type Group_EstimatedCallFieldsFragment = { destinationDisplay?: { frontText?: string, via?: Array<string> }, notices: Array<NoticeFragment>, serviceJourney: Group_ServiceJourneyFieldsFragment };

export type Group_Times_EstimatedCallFieldsFragment = { date: any, expectedDepartureTime: any, aimedDepartureTime: any, predictionInaccurate: boolean, realtime: boolean, cancellation: boolean, destinationDisplay?: { frontText?: string, via?: Array<string> }, notices: Array<NoticeFragment>, situations: Array<SituationFragment>, serviceJourney: { id: string, line: { id: string } }, bookingArrangements?: BookingArrangementFragment };

export type Group_NoticeFieldsFragment = { text?: string };

export type Group_QuayFieldsFragment = { id: string, name: string, description?: string, publicCode?: string, latitude?: number, longitude?: number, situations: Array<SituationFragment> };

export type Group_StopPlaceFieldsFragment = { id: string, description?: string, name: string, latitude?: number, longitude?: number };

export type Group_ServiceJourneyFieldsFragment = { id: string, directionType?: Types.DirectionType, privateCode?: string, transportSubmode?: Types.TransportSubmode, line: (
    { description?: string, name?: string, situations: Array<SituationFragment> }
    & LineFragment
  ), journeyPattern?: { notices: Array<NoticeFragment> }, notices: Array<NoticeFragment> };

export const Group_ServiceJourneyFieldsFragmentDoc = gql`
    fragment group_serviceJourneyFields on ServiceJourney {
  id
  directionType
  line {
    ...line
    description
    name
    situations {
      ...situation
    }
  }
  journeyPattern {
    notices {
      ...notice
    }
  }
  notices {
    ...notice
  }
  privateCode
  transportSubmode
}
    ${LineFragmentDoc}
${SituationFragmentDoc}
${NoticeFragmentDoc}`;
export const Group_EstimatedCallFieldsFragmentDoc = gql`
    fragment group_estimatedCallFields on EstimatedCall {
  destinationDisplay {
    frontText
    via
  }
  notices {
    ...notice
  }
  serviceJourney {
    ...group_serviceJourneyFields
  }
}
    ${NoticeFragmentDoc}
${Group_ServiceJourneyFieldsFragmentDoc}`;
export const Group_Times_EstimatedCallFieldsFragmentDoc = gql`
    fragment group_times_estimatedCallFields on EstimatedCall {
  destinationDisplay {
    frontText
    via
  }
  date
  expectedDepartureTime
  aimedDepartureTime
  predictionInaccurate
  realtime
  cancellation
  notices {
    ...notice
  }
  situations {
    ...situation
  }
  serviceJourney {
    id
    line {
      id
    }
  }
  bookingArrangements {
    ...bookingArrangement
  }
}
    ${NoticeFragmentDoc}
${SituationFragmentDoc}
${BookingArrangementFragmentDoc}`;
export const Group_NoticeFieldsFragmentDoc = gql`
    fragment group_noticeFields on Notice {
  text
}
    `;
export const Group_QuayFieldsFragmentDoc = gql`
    fragment group_quayFields on Quay {
  id
  name
  description
  publicCode
  latitude
  longitude
  situations {
    ...situation
  }
}
    ${SituationFragmentDoc}`;
export const Group_StopPlaceFieldsFragmentDoc = gql`
    fragment group_stopPlaceFields on StopPlace {
  id
  description
  name
  latitude
  longitude
}
    `;
export const GroupsByIdDocument = gql`
    query GroupsById($ids: [String]!, $startTime: DateTime!, $timeRange: Int!, $limitPerLine: Int!, $totalLimit: Int!, $filterByLineIds: [ID], $includeCancelledTrips: Boolean) {
  quays(ids: $ids) {
    ...group_quayFields
    stopPlace {
      ...group_stopPlaceFields
    }
    times: estimatedCalls(
      startTime: $startTime
      timeRange: $timeRange
      numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
      numberOfDepartures: $totalLimit
      arrivalDeparture: departures
      includeCancelledTrips: $includeCancelledTrips
      whiteListed: {lines: $filterByLineIds}
    ) {
      ...group_times_estimatedCallFields
    }
    estimatedCalls(
      startTime: $startTime
      timeRange: $timeRange
      numberOfDepartures: $totalLimit
      numberOfDeparturesPerLineAndDestinationDisplay: 1
      arrivalDeparture: departures
      includeCancelledTrips: $includeCancelledTrips
      whiteListed: {lines: $filterByLineIds}
    ) {
      ...group_estimatedCallFields
    }
  }
}
    ${Group_QuayFieldsFragmentDoc}
${Group_StopPlaceFieldsFragmentDoc}
${Group_Times_EstimatedCallFieldsFragmentDoc}
${Group_EstimatedCallFieldsFragmentDoc}`;
export const QuayIdInStopsDocument = gql`
    query QuayIdInStops($stopIds: [String]!) {
  stopPlaces(ids: $stopIds) {
    id
    quays(filterByInUse: true) {
      id
    }
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    GroupsById(variables: GroupsByIdQueryVariables, options?: C): Promise<GroupsByIdQuery> {
      return requester<GroupsByIdQuery, GroupsByIdQueryVariables>(GroupsByIdDocument, variables, options) as Promise<GroupsByIdQuery>;
    },
    QuayIdInStops(variables: QuayIdInStopsQueryVariables, options?: C): Promise<QuayIdInStopsQuery> {
      return requester<QuayIdInStopsQuery, QuayIdInStopsQueryVariables>(QuayIdInStopsDocument, variables, options) as Promise<QuayIdInStopsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;