import * as Types from '../../../../graphql/stops-types';

import gql from 'graphql-tag';

export type QuaysInMultimodalQueryVariables = Types.Exact<{
  stopId: Types.Scalars['String'];
}>;


export type QuaysInMultimodalQuery = { stopPlace?: Types.Maybe<Array<Types.Maybe<{ id?: Types.Maybe<string>, children?: Types.Maybe<Array<Types.Maybe<{ id?: Types.Maybe<string>, name?: Types.Maybe<{ value?: Types.Maybe<string> }> }>>> }>>> };


export const QuaysInMultimodalDocument = gql`
    query QuaysInMultimodal($stopId: String!) {
  stopPlace(id: $stopId) {
    ... on ParentStopPlace {
      id
      children {
        id
        name {
          value
        }
      }
    }
  }
}
    `;