import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { MultilingualStringFragment, InfoLinkFragment, ValidityPeriodFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MultilingualStringFragmentDoc, InfoLinkFragmentDoc, ValidityPeriodFragmentDoc } from './shared.graphql-gen';
export type SituationFragment = { id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<MultilingualStringFragment>, description: Array<MultilingualStringFragment>, advice: Array<MultilingualStringFragment>, infoLinks?: Array<InfoLinkFragment>, validityPeriod?: ValidityPeriodFragment, affects: Array<{ __typename: 'AffectedLine' } | { __typename: 'AffectedServiceJourney' } | { __typename: 'AffectedStopPlace', stopPlace?: { name: string }, quay?: { name: string } } | { __typename: 'AffectedStopPlaceOnLine', stopPlace?: { name: string }, quay?: { name: string } } | { __typename: 'AffectedStopPlaceOnServiceJourney', stopPlace?: { name: string }, quay?: { name: string } } | { __typename: 'AffectedUnknown' }> };

export const SituationFragmentDoc = gql`
    fragment situation on PtSituationElement {
  id
  situationNumber
  summary {
    ...multilingualString
  }
  description {
    ...multilingualString
  }
  reportType
  advice {
    ...multilingualString
  }
  infoLinks {
    ...infoLink
  }
  validityPeriod {
    ...validityPeriod
  }
  affects {
    __typename
    ... on AffectedStopPlace {
      stopPlace {
        name
      }
      quay {
        name
      }
    }
    ... on AffectedStopPlaceOnServiceJourney {
      stopPlace {
        name
      }
      quay {
        name
      }
    }
    ... on AffectedStopPlaceOnLine {
      stopPlace {
        name
      }
      quay {
        name
      }
    }
  }
}
    ${MultilingualStringFragmentDoc}
${InfoLinkFragmentDoc}
${ValidityPeriodFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;