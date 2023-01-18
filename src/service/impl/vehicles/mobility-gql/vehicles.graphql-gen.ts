import * as Types from '../../../../graphql/mobility/mobility-types_v2';

import { PricingPlanFragment, OperatorFragment, TranslatedStringFragment } from '../../fragments/mobility-gql/shared.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { PricingPlanFragmentDoc, OperatorFragmentDoc, TranslatedStringFragmentDoc } from '../../fragments/mobility-gql/shared.graphql-gen';
export type GetVehiclesQueryVariables = Types.Exact<{
  lat: Types.Scalars['Float'];
  lon: Types.Scalars['Float'];
  range: Types.Scalars['Int'];
  formFactors?: Types.InputMaybe<Array<Types.InputMaybe<Types.FormFactor>> | Types.InputMaybe<Types.FormFactor>>;
}>;


export type GetVehiclesQuery = { vehicles?: Array<{ id: string, lat: number, lon: number, pricingPlan: PricingPlanFragment, system: { operator: OperatorFragment, name: TranslatedStringFragment } }> };


export const GetVehiclesDocument = gql`
    query getVehicles($lat: Float!, $lon: Float!, $range: Int!, $formFactors: [FormFactor]) {
  vehicles(lat: $lat, lon: $lon, range: $range, formFactors: $formFactors) {
    id
    lat
    lon
    pricingPlan {
      ...pricingPlan
    }
    system {
      operator {
        ...operator
      }
      name {
        ...translatedString
      }
    }
  }
}
    ${PricingPlanFragmentDoc}
${OperatorFragmentDoc}
${TranslatedStringFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    getVehicles(variables: GetVehiclesQueryVariables, options?: C): Promise<GetVehiclesQuery> {
      return requester<GetVehiclesQuery, GetVehiclesQueryVariables>(GetVehiclesDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;