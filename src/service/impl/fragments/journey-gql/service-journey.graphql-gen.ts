import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LineFragment } from './lines.graphql-gen';
import { NoticeFragment } from './notices.graphql-gen';
import { EstimatedCallWithQuayFragment } from './estimated-calls.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LineFragmentDoc } from './lines.graphql-gen';
import { NoticeFragmentDoc } from './notices.graphql-gen';
import { EstimatedCallWithQuayFragmentDoc } from './estimated-calls.graphql-gen';
export type ServiceJourneyWithEstCallsFragment = { id: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, line: LineFragment, journeyPattern?: { notices: Array<NoticeFragment> }, notices: Array<NoticeFragment>, estimatedCalls: Array<EstimatedCallWithQuayFragment> };

export const ServiceJourneyWithEstCallsFragmentDoc = gql`
    fragment serviceJourneyWithEstCalls on ServiceJourney {
  id
  transportMode
  transportSubmode
  publicCode
  line {
    ...line
  }
  journeyPattern {
    notices {
      ...notice
    }
  }
  notices {
    ...notice
  }
  estimatedCalls(date: $date) {
    ...estimatedCallWithQuay
  }
}
    ${LineFragmentDoc}
${NoticeFragmentDoc}
${EstimatedCallWithQuayFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;