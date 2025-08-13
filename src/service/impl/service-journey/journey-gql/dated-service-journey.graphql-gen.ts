import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type DatedServiceJourneyQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type DatedServiceJourneyQuery = { datedServiceJourney?: { id: string, estimatedCalls: Array<{ expectedDepartureTime: any, expectedArrivalTime: any, quay: { stopPlace?: { id: string, name: string } } }>, serviceJourney: { transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, line: { publicCode?: string, name?: string } } } };


export const DatedServiceJourneyDocument = gql`
    query DatedServiceJourney($id: String!) {
  datedServiceJourney(id: $id) {
    id
    estimatedCalls {
      expectedDepartureTime
      expectedArrivalTime
      quay {
        stopPlace {
          id
          name
        }
      }
    }
    serviceJourney {
      transportMode
      transportSubmode
      line {
        publicCode
        name
      }
    }
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    DatedServiceJourney(variables: DatedServiceJourneyQueryVariables, options?: C): Promise<DatedServiceJourneyQuery> {
      return requester<DatedServiceJourneyQuery, DatedServiceJourneyQueryVariables>(DatedServiceJourneyDocument, variables, options) as Promise<DatedServiceJourneyQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;