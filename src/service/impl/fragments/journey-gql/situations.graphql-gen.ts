import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { MultilingualStringFragmentDoc, InfoLinkFragmentDoc, ValidityPeriodFragmentDoc } from './shared.graphql-gen';
export type SituationFragment = { id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } };

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
}
    ${MultilingualStringFragmentDoc}
${InfoLinkFragmentDoc}
${ValidityPeriodFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;