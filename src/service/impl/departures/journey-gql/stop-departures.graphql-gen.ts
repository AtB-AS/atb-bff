import * as Types from '../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
export type StopPlaceQuayDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']>;
  limitPerLine?: Types.InputMaybe<Types.Scalars['Int']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']>;
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']>> | Types.InputMaybe<Types.Scalars['ID']>>;
}>;


export type StopPlaceQuayDeparturesQuery = { stopPlace?: { id: string, quays?: Array<{ id: string, estimatedCalls: Array<{ date: any, expectedDepartureTime: any, aimedDepartureTime: any, realtime: boolean, cancellation: boolean, quay: { id: string }, destinationDisplay?: { frontText?: string }, serviceJourney: { id: string, line: { id: string, description?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, notices: Array<{ id: string, text?: string }> }, journeyPattern?: { notices: Array<{ id: string, text?: string }> }, notices: Array<{ id: string, text?: string }> }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, notices: Array<{ id: string, text?: string }> }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }> }> } };


export const StopPlaceQuayDeparturesDocument = gql`
    query stopPlaceQuayDepartures($id: String!, $numberOfDepartures: Int, $limitPerLine: Int, $startTime: DateTime, $timeRange: Int, $filterByLineIds: [ID]) {
  stopPlace(id: $id) {
    id
    quays(filterByInUse: true) {
      id
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
}
    ${NoticeFragmentDoc}
${SituationFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    stopPlaceQuayDepartures(variables: StopPlaceQuayDeparturesQueryVariables, options?: C): Promise<StopPlaceQuayDeparturesQuery> {
      return requester<StopPlaceQuayDeparturesQuery, StopPlaceQuayDeparturesQueryVariables>(StopPlaceQuayDeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;