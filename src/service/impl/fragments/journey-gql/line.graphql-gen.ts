import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { AuthorityFragment } from './authority.graphql-gen';
import { NoticeFragment } from './notices.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { AuthorityFragmentDoc } from './authority.graphql-gen';
import { NoticeFragmentDoc } from './notices.graphql-gen';
export type LineFragment = { id: string, publicCode?: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, authority?: AuthorityFragment, notices: Array<NoticeFragment> };

export const LineFragmentDoc = gql`
    fragment line on Line {
  id
  authority {
    ...authority
  }
  publicCode
  notices {
    ...notice
  }
  transportMode
  transportSubmode
}
    ${AuthorityFragmentDoc}
${NoticeFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;