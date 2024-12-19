import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LineFragment } from '../../fragments/journey-gql/lines.graphql-gen';
import { NoticeFragment } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragment } from '../../fragments/journey-gql/situations.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LineFragmentDoc } from '../../fragments/journey-gql/lines.graphql-gen';
import { NoticeFragmentDoc } from '../../fragments/journey-gql/notices.graphql-gen';
import { SituationFragmentDoc } from '../../fragments/journey-gql/situations.graphql-gen';
export type StopPlaceQuayDeparturesQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limitPerLine?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  startTime?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  timeRange?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filterByLineIds?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['ID']['input']>> | Types.InputMaybe<Types.Scalars['ID']['input']>>;
}>;


export type StopPlaceQuayDeparturesQuery = { stopPlace?: { id: string, quays?: Array<{ id: string, estimatedCalls: Array<{ date: any, expectedDepartureTime: any, aimedDepartureTime: any, realtime: boolean, cancellation: boolean, quay: { id: string }, destinationDisplay?: { frontText?: string }, serviceJourney: { id: string, line: (
            { description?: string }
            & LineFragment
          ), journeyPattern?: { notices: Array<NoticeFragment> }, notices: Array<NoticeFragment> }, situations: Array<SituationFragment>, notices: Array<NoticeFragment> }>, situations: Array<SituationFragment> }> } };


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
            ...line
            description
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
    ${LineFragmentDoc}
${NoticeFragmentDoc}
${SituationFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    stopPlaceQuayDepartures(variables: StopPlaceQuayDeparturesQueryVariables, options?: C): Promise<StopPlaceQuayDeparturesQuery> {
      return requester<StopPlaceQuayDeparturesQuery, StopPlaceQuayDeparturesQueryVariables>(StopPlaceQuayDeparturesDocument, variables, options) as Promise<StopPlaceQuayDeparturesQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;