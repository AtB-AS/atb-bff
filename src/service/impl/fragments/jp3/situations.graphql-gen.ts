import * as Types from '../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type SituationFragment = { id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> };

export const SituationFragmentDoc = gql`
    fragment situation on PtSituationElement {
  id
  situationNumber
  summary {
    language
    value
  }
  description {
    language
    value
  }
  reportType
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;