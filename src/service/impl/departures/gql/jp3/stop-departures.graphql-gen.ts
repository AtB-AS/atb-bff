import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { SituationFragmentDoc } from '../../../fragments/jp3/situations.graphql-gen';
export type StopPlaceQuayDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']>;
  limitPerLine?: Types.InputMaybe<Types.Scalars['Int']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']>;
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']>> | Types.InputMaybe<Types.Scalars['ID']>>;
}>;


export type StopPlaceQuayDeparturesQuery = { stopPlace?: { id: string, quays?: Array<{ id: string, estimatedCalls: Array<{ date?: any, expectedDepartureTime: any, aimedDepartureTime: any, realtime: boolean, cancellation: boolean, quay?: { id: string }, destinationDisplay?: { frontText?: string }, serviceJourney?: { id: string, line: { id: string, description?: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode } }, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }> }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }> }> } };


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
          }
        }
        situations {
          ...situation
        }
      }
      situations {
        ...situation
      }
    }
  }
}
    ${SituationFragmentDoc}`;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    stopPlaceQuayDepartures(variables: StopPlaceQuayDeparturesQueryVariables, options?: C): Promise<StopPlaceQuayDeparturesQuery> {
      return requester<StopPlaceQuayDeparturesQuery, StopPlaceQuayDeparturesQueryVariables>(StopPlaceQuayDeparturesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;