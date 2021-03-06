import * as Types from '../../../../graphql/journey-types';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type GroupsByIdQueryVariables = Types.Exact<{
  ids?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>>;
  startTime: Types.Scalars['DateTime'];
  timeRange: Types.Scalars['Int'];
  limitPerLine: Types.Scalars['Int'];
  totalLimit: Types.Scalars['Int'];
  filterByLineIds?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>>;
}>;


export type GroupsByIdQuery = { stopPlaces: Array<Types.Maybe<(
    { quays?: Types.Maybe<Array<Types.Maybe<(
      { times: Array<Types.Maybe<Group_Times_EstimatedCallFieldsFragment>>, estimatedCalls: Array<Types.Maybe<Group_EstimatedCallFieldsFragment>> }
      & Group_QuayFieldsFragment
    )>>> }
    & Group_StopPlaceFieldsFragment
  )>> };

export type QuayIdInStopsQueryVariables = Types.Exact<{
  stopIds: Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>;
}>;


export type QuayIdInStopsQuery = { stopPlaces: Array<Types.Maybe<{ id: string, quays?: Types.Maybe<Array<Types.Maybe<{ id: string }>>> }>> };

export type GroupsByNearestQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lng: Types.Scalars['Float'];
  distance: Types.Scalars['Int'];
  startTime: Types.Scalars['DateTime'];
  fromCursor?: Types.Maybe<Types.Scalars['String']>;
  pageSize?: Types.Maybe<Types.Scalars['Int']>;
  timeRange: Types.Scalars['Int'];
  limitPerLine: Types.Scalars['Int'];
  totalLimit: Types.Scalars['Int'];
  filterInput?: Types.Maybe<Types.InputFilters>;
  filterByLineIds?: Types.Maybe<Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>>;
}>;


export type GroupsByNearestQuery = { nearest?: Types.Maybe<{ pageInfo: { hasNextPage: boolean, endCursor?: Types.Maybe<string> }, edges?: Types.Maybe<Array<Types.Maybe<{ cursor: string, node?: Types.Maybe<{ distance?: Types.Maybe<number>, place?: Types.Maybe<(
          { quays?: Types.Maybe<Array<Types.Maybe<(
            { times: Array<Types.Maybe<Group_Times_EstimatedCallFieldsFragment>>, estimatedCalls: Array<Types.Maybe<Group_EstimatedCallFieldsFragment>> }
            & Group_QuayFieldsFragment
          )>>> }
          & Group_StopPlaceFieldsFragment
        )> }> }>>> }> };

export type Group_EstimatedCallFieldsFragment = { destinationDisplay?: Types.Maybe<{ frontText?: Types.Maybe<string> }>, notices: Array<Types.Maybe<Group_NoticeFieldsFragment>>, serviceJourney?: Types.Maybe<Group_ServiceJourneyFieldsFragment> };

export type Group_Times_EstimatedCallFieldsFragment = { expectedDepartureTime?: Types.Maybe<any>, aimedDepartureTime?: Types.Maybe<any>, predictionInaccurate?: Types.Maybe<boolean>, realtime?: Types.Maybe<boolean>, destinationDisplay?: Types.Maybe<{ frontText?: Types.Maybe<string> }>, notices: Array<Types.Maybe<Group_NoticeFieldsFragment>>, situations: Array<Types.Maybe<Group_SituationFieldsFragment>>, serviceJourney?: Types.Maybe<{ id: string, line: { id: string } }> };

export type Group_NoticeFieldsFragment = { text?: Types.Maybe<string> };

export type Group_QuayFieldsFragment = { id: string, name: string, description?: Types.Maybe<string>, publicCode?: Types.Maybe<string>, latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number>, situations: Array<Types.Maybe<Group_SituationFieldsFragment>> };

export type Group_SituationFieldsFragment = { situationNumber?: Types.Maybe<string>, reportType?: Types.Maybe<Types.ReportType>, summary: Array<{ language?: Types.Maybe<string>, value?: Types.Maybe<string> }>, description: Array<{ language?: Types.Maybe<string>, value?: Types.Maybe<string> }>, advice: Array<{ language?: Types.Maybe<string>, value?: Types.Maybe<string> }>, validityPeriod?: Types.Maybe<{ startTime?: Types.Maybe<any>, endTime?: Types.Maybe<any> }>, infoLinks?: Types.Maybe<Array<Types.Maybe<{ uri?: Types.Maybe<string>, label?: Types.Maybe<string> }>>> };

export type Group_LineFieldsFragment = { description?: Types.Maybe<string>, flexibleLineType?: Types.Maybe<Types.FlexibleLineType>, id: string, name?: Types.Maybe<string>, transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode>, publicCode?: Types.Maybe<string>, notices: Array<Types.Maybe<Group_NoticeFieldsFragment>>, situations: Array<Types.Maybe<Group_SituationFieldsFragment>> };

export type Group_StopPlaceFieldsFragment = { id: string, description?: Types.Maybe<string>, name: string, latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number> };

export type Group_ServiceJourneyFieldsFragment = { id: string, directionType?: Types.Maybe<Types.DirectionType>, privateCode?: Types.Maybe<string>, transportSubmode?: Types.Maybe<Types.TransportSubmode>, line: Group_LineFieldsFragment, journeyPattern?: Types.Maybe<{ notices: Array<Types.Maybe<Group_NoticeFieldsFragment>> }>, notices: Array<Types.Maybe<Group_NoticeFieldsFragment>> };

export const Group_NoticeFieldsFragmentDoc = gql`
    fragment group_noticeFields on Notice {
  text
}
    `;
export const Group_SituationFieldsFragmentDoc = gql`
    fragment group_situationFields on PtSituationElement {
  situationNumber
  summary {
    language
    value
  }
  description {
    language
    value
  }
  advice {
    language
    value
  }
  validityPeriod {
    startTime
    endTime
  }
  reportType
  infoLinks {
    uri
    label
  }
}
    `;
export const Group_LineFieldsFragmentDoc = gql`
    fragment group_lineFields on Line {
  description
  flexibleLineType
  id
  name
  transportMode
  transportSubmode
  notices {
    ...group_noticeFields
  }
  situations {
    ...group_situationFields
  }
  publicCode
  transportMode
  transportSubmode
}
    ${Group_NoticeFieldsFragmentDoc}
${Group_SituationFieldsFragmentDoc}`;
export const Group_ServiceJourneyFieldsFragmentDoc = gql`
    fragment group_serviceJourneyFields on ServiceJourney {
  id
  directionType
  line {
    ...group_lineFields
  }
  journeyPattern {
    notices {
      ...group_noticeFields
    }
  }
  notices {
    ...group_noticeFields
  }
  privateCode
  transportSubmode
}
    ${Group_LineFieldsFragmentDoc}
${Group_NoticeFieldsFragmentDoc}`;
export const Group_EstimatedCallFieldsFragmentDoc = gql`
    fragment group_estimatedCallFields on EstimatedCall {
  destinationDisplay {
    frontText
  }
  notices {
    ...group_noticeFields
  }
  serviceJourney {
    ...group_serviceJourneyFields
  }
}
    ${Group_NoticeFieldsFragmentDoc}
${Group_ServiceJourneyFieldsFragmentDoc}`;
export const Group_Times_EstimatedCallFieldsFragmentDoc = gql`
    fragment group_times_estimatedCallFields on EstimatedCall {
  destinationDisplay {
    frontText
  }
  expectedDepartureTime
  aimedDepartureTime
  predictionInaccurate
  realtime
  notices {
    ...group_noticeFields
  }
  situations {
    ...group_situationFields
  }
  serviceJourney {
    id
    line {
      id
    }
  }
}
    ${Group_NoticeFieldsFragmentDoc}
${Group_SituationFieldsFragmentDoc}`;
export const Group_QuayFieldsFragmentDoc = gql`
    fragment group_quayFields on Quay {
  id
  name
  description
  publicCode
  latitude
  longitude
  situations {
    ...group_situationFields
  }
}
    ${Group_SituationFieldsFragmentDoc}`;
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
    query GroupsById($ids: [String], $startTime: DateTime!, $timeRange: Int!, $limitPerLine: Int!, $totalLimit: Int!, $filterByLineIds: [String]) {
  stopPlaces(ids: $ids) {
    ...group_stopPlaceFields
    quays(filterByInUse: true) {
      ...group_quayFields
      times: estimatedCalls(
        startTime: $startTime
        timeRange: $timeRange
        numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
        numberOfDepartures: $totalLimit
        omitNonBoarding: false
        includeCancelledTrips: false
        whiteListed: {lines: $filterByLineIds}
      ) {
        ...group_times_estimatedCallFields
      }
      estimatedCalls(
        startTime: $startTime
        timeRange: $timeRange
        numberOfDepartures: $totalLimit
        numberOfDeparturesPerLineAndDestinationDisplay: 1
        omitNonBoarding: false
        includeCancelledTrips: false
        whiteListed: {lines: $filterByLineIds}
      ) {
        ...group_estimatedCallFields
      }
    }
  }
}
    ${Group_StopPlaceFieldsFragmentDoc}
${Group_QuayFieldsFragmentDoc}
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
export const GroupsByNearestDocument = gql`
    query GroupsByNearest($lat: Float!, $lng: Float!, $distance: Int!, $startTime: DateTime!, $fromCursor: String, $pageSize: Int, $timeRange: Int!, $limitPerLine: Int!, $totalLimit: Int!, $filterInput: InputFilters, $filterByLineIds: [String]) {
  nearest(
    latitude: $lat
    longitude: $lng
    after: $fromCursor
    first: $pageSize
    maximumDistance: $distance
    filterByPlaceTypes: stopPlace
    filterByInUse: true
    filterByIds: $filterInput
    multiModalMode: child
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        distance
        place {
          ... on StopPlace {
            ...group_stopPlaceFields
            quays {
              ...group_quayFields
              times: estimatedCalls(
                startTime: $startTime
                timeRange: $timeRange
                numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
                numberOfDepartures: $totalLimit
                omitNonBoarding: false
                includeCancelledTrips: false
                whiteListed: {lines: $filterByLineIds}
              ) {
                ...group_times_estimatedCallFields
              }
              estimatedCalls(
                startTime: $startTime
                timeRange: $timeRange
                numberOfDepartures: $totalLimit
                numberOfDeparturesPerLineAndDestinationDisplay: 1
                omitNonBoarding: false
                includeCancelledTrips: false
                whiteListed: {lines: $filterByLineIds}
              ) {
                ...group_estimatedCallFields
              }
            }
          }
        }
      }
    }
  }
}
    ${Group_StopPlaceFieldsFragmentDoc}
${Group_QuayFieldsFragmentDoc}
${Group_Times_EstimatedCallFieldsFragmentDoc}
${Group_EstimatedCallFieldsFragmentDoc}`;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    GroupsById(variables: GroupsByIdQueryVariables, options?: C): Promise<GroupsByIdQuery> {
      return requester<GroupsByIdQuery, GroupsByIdQueryVariables>(GroupsByIdDocument, variables, options);
    },
    QuayIdInStops(variables: QuayIdInStopsQueryVariables, options?: C): Promise<QuayIdInStopsQuery> {
      return requester<QuayIdInStopsQuery, QuayIdInStopsQueryVariables>(QuayIdInStopsDocument, variables, options);
    },
    GroupsByNearest(variables: GroupsByNearestQueryVariables, options?: C): Promise<GroupsByNearestQuery> {
      return requester<GroupsByNearestQuery, GroupsByNearestQueryVariables>(GroupsByNearestDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;