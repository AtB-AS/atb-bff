import * as Types from '../../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type FavouriteDepartureQueryVariables = Types.Exact<{
  quayIds?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']>>
    | Types.InputMaybe<Types.Scalars['String']>
  >;
  lines?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['ID']>>
    | Types.InputMaybe<Types.Scalars['ID']>
  >;
}>;

export type FavouriteDepartureQuery = {
  quays: Array<{
    id: string;
    name: string;
    estimatedCalls: Array<{
      aimedDepartureTime: any;
      serviceJourney?: { line: { id: string } };
      destinationDisplay?: { frontText?: string };
    }>;
  }>;
};

export const FavouriteDepartureDocument = gql`
  query favouriteDeparture($quayIds: [String], $lines: [ID]) {
    quays(ids: $quayIds) {
      id
      name
      estimatedCalls(whiteListed: { lines: $lines }, numberOfDepartures: 14) {
        serviceJourney {
          line {
            id
          }
        }
        aimedDepartureTime
        destinationDisplay {
          frontText
        }
      }
    }
  }
`;
export type Requester<C = {}> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C
) => Promise<R>;
export function getSdk<C>(requester: Requester<C>) {
  return {
    favouriteDeparture(
      variables?: FavouriteDepartureQueryVariables,
      options?: C
    ): Promise<FavouriteDepartureQuery> {
      return requester<
        FavouriteDepartureQuery,
        FavouriteDepartureQueryVariables
      >(FavouriteDepartureDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
