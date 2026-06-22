import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { MultilingualStringFragment, InfoLinkFragment, ValidityPeriodFragment } from './shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MultilingualStringFragmentDoc, InfoLinkFragmentDoc, ValidityPeriodFragmentDoc } from './shared.graphql-gen';
export type SituationFragment = { id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<MultilingualStringFragment>, description: Array<MultilingualStringFragment>, advice: Array<MultilingualStringFragment>, infoLinks?: Array<InfoLinkFragment>, validityPeriod?: ValidityPeriodFragment, affects: Array<Affects_AffectedLine_Fragment | Affects_AffectedServiceJourney_Fragment | Affects_AffectedStopPlace_Fragment | Affects_AffectedStopPlaceOnLine_Fragment | Affects_AffectedStopPlaceOnServiceJourney_Fragment | Affects_AffectedUnknown_Fragment> };

export type Affects_AffectedLine_Fragment = { __typename: 'AffectedLine' };

export type Affects_AffectedServiceJourney_Fragment = { __typename: 'AffectedServiceJourney' };

export type Affects_AffectedStopPlace_Fragment = { __typename: 'AffectedStopPlace', stopPlace?: { name: string }, quay?: { name: string } };

export type Affects_AffectedStopPlaceOnLine_Fragment = { __typename: 'AffectedStopPlaceOnLine', stopPlace?: { name: string }, quay?: { name: string } };

export type Affects_AffectedStopPlaceOnServiceJourney_Fragment = { __typename: 'AffectedStopPlaceOnServiceJourney', stopPlace?: { name: string }, quay?: { name: string } };

export type Affects_AffectedUnknown_Fragment = { __typename: 'AffectedUnknown' };

export type AffectsFragment = Affects_AffectedLine_Fragment | Affects_AffectedServiceJourney_Fragment | Affects_AffectedStopPlace_Fragment | Affects_AffectedStopPlaceOnLine_Fragment | Affects_AffectedStopPlaceOnServiceJourney_Fragment | Affects_AffectedUnknown_Fragment;

export const AffectsFragmentDoc = gql`
    fragment affects on Affects {
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
    `;
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
    ...affects
  }
}
    ${MultilingualStringFragmentDoc}
${InfoLinkFragmentDoc}
${ValidityPeriodFragmentDoc}
${AffectsFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;