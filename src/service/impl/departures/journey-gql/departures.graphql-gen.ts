import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
export type DeparturesQueryVariables = Types.Exact<{
  ids: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']>;
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']>> | Types.InputMaybe<Types.Scalars['ID']>>;
  limitPerLine?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type DeparturesQuery = { quays: Array<{ id: string, description?: string, publicCode?: string, name: string, estimatedCalls: Array<{ date: any, expectedDepartureTime: any, aimedDepartureTime: any, realtime: boolean, cancellation: boolean, quay: { id: string }, destinationDisplay?: { frontText?: string, via?: Array<string> }, serviceJourney: { id: string, line: { id: string, description?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ id: string, text?: string }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, notices: Array<{ id: string, text?: string }> }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }> };


export const DeparturesDocument = gql`
    query departures($ids: [String]!, $numberOfDepartures: Int, $startTime: DateTime, $timeRange: Int, $filterByLineIds: [ID], $limitPerLine: Int) {
  quays(ids: $ids) {
    id
    description
    publicCode
    name
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      startTime: $startTime
      timeRange: $timeRange
      includeCancelledTrips: true
      whiteListed: {lines: $filterByLineIds}
      numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine
    ) {
      date
      expectedDepartureTime
      aimedDepartureTime
      realtime
      cancellation
      quay {
        id
      }
      destinationDisplay {
        frontText
        via
      }
      serviceJourney {
        id
        line {
          id
          description
          publicCode
          transportMode
          transportSubmode
          notices {
            ...notice
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
      }
      situations {
        ...situation
      }
      notices {
        ...notice
      }
    }
    situations {
      ...situation
    }
  }
}
    ${NoticeFragmentDoc}
${SituationFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    departures(variables: DeparturesQueryVariables, options?: C): Promise<DeparturesQuery> {
      return requester<DeparturesQuery, DeparturesQueryVariables>(DeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;